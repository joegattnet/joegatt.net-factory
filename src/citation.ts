export {};

const chalk = require("chalk");
const { Client } = require("pg");
const sanitize = require("sanitize-html");
const parse = require("./components/parse");
const tidyHtml = require("./components/tidyHtml");
const byline = require("./components/byline");
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

const formatCitation = (note: Note): updateCitationValues => {
  // discard extra
  // let text = note.body.slice(0, note.body.indexOf("--30--"));
  let text = note.body;

  // parse
  text = parse(text);

  // dequote
  text = text.replace(/{quote:(.*?)}/gm, "$1");

  // Split
  let [citationText, attribution] = text.split(/\n--\s*|\n—\s*/);

  attribution = sanitize(attribution, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  const blurbText = sanitize(citationText, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  // fix link
  let blurbAttribution =
    attribution &&
    attribution.replace(/(https?:\/\/)(www\.)?([^\/]+)+(\/.*)?\b/gm, "$3");

  // bylines
  blurbAttribution = byline(blurbAttribution);

  const bodyAttribution =
    attribution &&
    attribution.replace(
      /(https?:\/\/)(.+?\.[a-z]{2,})\b(.*?)\b/gm,
      '<a href="$1$2$3">$2</a>'
    );

  const path = `/citations/${note.id}`;
  const blurb = tidyHtml(`
    <figure class="citation">
      <blockquote>${blurbText}</blockquote>
      <figcaption>${blurbAttribution}</figcaption>
    </figure>
  `);
  const body = tidyHtml(`
    <figure class="citation">
      <blockquote>${citationText}</blockquote>
      <figcaption>${bodyAttribution}</figcaption>
    </figure>
  `);

  return {
    id: note.id,
    path: path,
    blurb: blurb.trim(),
    body: body.trim(),
  };
};

const fetchCitations = async () => {
  const results = await client.query(selectCitationsSql);
  return results.rows;
};

const updateCitation = async (values: updateCitationValues) => {
  console.group(values);
  const result = await client.query(updateCitationSql, [
    values.id,
    values.path,
    values.blurb,
    values.body,
  ]);
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

// updateAllCitations();

module.exports = { formatCitation, updateAllCitations };
