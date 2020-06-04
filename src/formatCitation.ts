export {};

const chalk = require("chalk");
const { Client } = require("pg");
const htmlparser2 = require("htmlparser2");
const pretty = require("pretty");
const clean = require("./components/clean");
const config = require("./config");

const client = new Client(config.DB_CONNECTION);
client.connect();

const selectSql = `
  SELECT *
  FROM notes
  WHERE content_type = 1
  ORDER BY groomed_at
  LIMIT 999
`;

const updateCitationSql = `
  UPDATE notes 
  SET cached_url = $2,
    cached_blurb_html = $3,
    cached_source_html = $4,
    cached_body_html = $5,
    groomed_at = NOW()
  WHERE id = $1
`;

type updateCitationValues = [number, string, string, string, string];

const runSql = async (sql: string, values?: updateCitationValues) => {
  try {
    const results = await client.query(sql, values);
    return results.rows;
  } catch (error) {
    console.log(error.stack);
  }
};

const updateCitation = (note: Note): any => {
  console.log(
    chalk.blue(
      `Updating "${note.title} | ${note.source_url} | ${note.cached_url} | ${note.cached_source_html}" ...`
    )
  );
  let text = "";
  const parser = new htmlparser2.Parser(
    {
      onopentag(tagName: string, attributes: Attributes) {
        if (tagName === "a") {
          text = text.concat(`<a href="${attributes.href}">`);
        }
        if (config.ALLOWED_TAGS.includes(tagName)) {
          text = text.concat(`<${tagName}>`);
        }
        if (config.SPANNED_TAGS.includes(tagName)) {
          text = text.concat(`<span class="${tagName}">`);
        }
        if (tagName === "br") {
          text = text.concat("\n");
        }
      },
      ontext(textFragment: string) {
        if (textFragment.trim() === "") {
          return (text = text.concat(" "));
        }
        text = text.concat(clean(textFragment));
      },
      onclosetag(tagName: string) {
        console.log(chalk.blue(tagName));
        if (config.SPANNED_TAGS.includes(tagName)) {
          text = text.concat("</span>");
        }
        if (config.ALLOWED_TAGS.concat("a").includes(tagName)) {
          text = text.concat(`</${tagName}>`);
        }
      },
    },
    { decodeEntities: true }
  );

  // SECTIONS & PARAGRAPHS
  text = text
    .replace(/[\n]+/gm, "\n")
    .split(/\n/)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");

  // SPACES
  const trimTextOpen = new RegExp(/>\s*/, "gm");
  const trimTextClose = new RegExp(/\s*</, "gm");
  const trimDoubleSpace = new RegExp(/  +/, "gm");

  text = text.replace(trimTextOpen, ">");
  text = text.replace(trimTextClose, "<");
  text = text.replace(trimDoubleSpace, " ");

  text = text.replace(/<p>{quote:(.*?)}<\/p>/gm, "<blockquote>$1</blockquote>");
  text = text.replace(/a>(\w)/gm, "a> $1");
  text = text.replace(/\s* <\//gm, "</");

  text = pretty(text, { ocd: true });

  text = text.replace(/classname/gm, "class");

  // console.log(chalk.red(text.replace(/\u00AD/g, "~")));
  // console.log(chalk.magenta(text));

  const cachedUrl = `/citations/${note.id}`;
  const cachedBlurbHtml = note.title;
  const cachedSourceHtml = "yyy";
  const cachedBodyHtml = `
    <figure class="citation">
      <blockquote>${text}</blockquote>
      <figcaption>badidda</figcaption>
    </figure>
  `;

  runSql(updateCitationSql, [
    note.id,
    cachedUrl,
    cachedBlurbHtml,
    cachedSourceHtml,
    cachedBodyHtml,
  ]).then(() => console.log(`Updated note ${note.id}: ${note.title}`));
};

runSql(selectSql)
  .then((rows: Array<Note>) => {
    if (rows.length) {
      rows.forEach((row) => updateCitation(row));
      return console.log(chalk.bold.green(`${rows.length} citations updated!`));
    }
    return console.log(chalk.bold.red("Nothing found!"));
  })
  .then(() => process.exit());
