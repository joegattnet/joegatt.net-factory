// https://github.com/jkasun/sa-node-postgres
// https://medium.com/@simon.white/postgres-publish-subscribe-with-nodejs-996a7e45f88

export {};

const { Client } = require("pg");
const chalk = require("chalk");
const htmlparser2 = require("htmlparser2");
const pretty = require("pretty");

// const bodify = require('./bodify');
const { clean } = require("./components/clean");

const client = new Client({
  user: "deployer",
  host: "172.19.0.2",
  database: "joegattnet",
  password: "itTieni10",
  port: 5432,
});

client.connect();

const selectSql = `
  SELECT *
  FROM notes
  WHERE content_type = 1
  ORDER BY groomed_at
  LIMIT 999
`;
// WHERE content_type = 0 AND (groomed_at IS NULL OR groomed_at < updated_at) AND id = 164

const updateSql = `
  UPDATE notes 
  SET cached_url = $2,
    cached_blurb_html = $3,
    cached_source_html = $4,
    groomed_at = NOW()
  WHERE id = $1
`;
// annotations_count

const runSql = async (sql: string, values: Array<string>) => {
  try {
    const results = await client.query(sql, values);
    return results.rows;
  } catch (error) {
    console.log(error.stack);
  }
};

const updateCitation = (note: any): any => {
  console.log("Updating ", chalk.black.bgYellow(note.title), "...");

  let text = "";
  const parser = new htmlparser2.Parser(
    {
      onopentag(tagName: string, attributes: any) {
        console.log(
          chalk.black.bgCyan(tagName),
          chalk.magenta(JSON.stringify(attributes))
        );
        // if (tagName === 'div') {
        //   text = text.concat(`<p>`);
        // }
        if (tagName === "a") {
          text = text.concat(`<a href="${attributes.href}">`);
        }
        if (["ol", "ul", "li", "table", "tr", "td"].includes(tagName)) {
          text = text.concat(`<${tagName}>`);
        }
        if (["em", "strong"].includes(tagName)) {
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
        if (["em", "strong"].includes(tagName)) {
          text = text.concat("</span>");
        }
        if (["a", "ol", "ul", "li", "table", "tr", "td"].includes(tagName)) {
          text = text.concat(`</${tagName}>`);
        }
      },
    },
    { decodeEntities: true }
  );

  // parser.write(note.body.slice(0, note.body.indexOf('--30--')));
  // parser.end();

  // SECTIONS & PARAGRAPHS
  text = text
    .replace(/[\n]+/gm, "\n")
    .split(/\n/)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");

  // ANNOTATIONS
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

  console.log(chalk.red(text.replace(/\u00AD/g, "~")));
  // Object.keys(note).sort().forEach(key => console.log(chalk.magenta(key)));
  console.log(chalk.magenta(text));

  const cachedUrl = `/citations/${note.id}`;
  const cachedBlurbHtml = "xxx";
  const cachedSourceHtml = "yyy";

  runSql(updateSql, [
    note.id,
    cachedUrl,
    cachedBlurbHtml,
    cachedSourceHtml,
  ]).then(() => console.log(`Updated note ${note.id}: ${note.title}`));
};

runSql(selectSql, []).then((rows: Array<Note>) =>
  rows.length
    ? rows.forEach((row: object) => void updateCitation(row))
    : console.log(chalk.bold.red("Nothing found!"))
);

process.exit();
