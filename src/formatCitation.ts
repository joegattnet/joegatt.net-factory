export {};

const chalk = require("chalk");
const { Client } = require("pg");
const parse = require("./components/parse");
const tidyHtml = require("./components/tidyHtml");
const config = require("./config");

const client = new Client(config.DB_CONNECTION);
client.connect();

const selectCitationsSql = `
  SELECT *
  FROM notes
  WHERE content_type = 1
  ORDER BY groomed_at
  LIMIT 9999
`;

const updateCitationSql = `
  UPDATE notes 
  SET cached_url = $2,
    cached_blurb_html = $3,
    cached_body_html = $4,
    groomed_at = NOW()
  WHERE id = $1
`;

type updateCitationValues = [number, string, string, string];

const formatCitation = (note: Note): updateCitationValues => {
  // discard extra
  let text = note.body.slice(0, note.body.indexOf("--30--"));

  // parse
  text = parse(text);

  // dequote
  text = text.replace(/\{quote:\s*(.*?)\}?/gm, "$1");

  // Tidy Html
  text = tidyHtml(text);

  // Split
  const [citationText, source] = text.split(/\n--\s*|—/);

  const cachedUrl = `/citations/${note.id}`;
  const cachedBlurbHtml = `
    <figure class="citation">
      <blockquote>${citationText}</blockquote>
      <figcaption>${source}</figcaption>
    </figure>
  `;
  const cachedBodyHtml = `
    <figure class="citation">
      <blockquote>${citationText}</blockquote>
      <figcaption>${source}</figcaption>
    </figure>
  `;

  return [note.id, cachedUrl, cachedBlurbHtml, cachedBodyHtml];
};

const fetchCitations = async () => {
  const results = await client.query(selectCitationsSql);
  return results.rows;
};

const updateCitation = async (values: updateCitationValues) => {
  console.group(values);
  const result = await client.query(updateCitationSql, values);
  return result;
};

const updateAllCitations = async () => {
  try {
    const citations = await fetchCitations();
    await Promise.all(
      citations.map(async (citation: Note) => {
        const formattedCitation = formatCitation(citation);
        const result = await updateCitation(formattedCitation);
        return result.rowCount;
      })
    );
    console.log(chalk.bold.green(`Updated ${citations.length} citations!`));
  } catch (error) {
    console.log(chalk.bold.red(`Updating citations faied: ${error}`));
  }

  client.end();
  process.exit();
};

updateAllCitations();
