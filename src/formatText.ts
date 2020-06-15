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
  WHERE content_type = 0
  ORDER BY groomed_at
  LIMIT 999
`;

const updateTextSql = `
  UPDATE notes 
  SET cached_url = $2,
    cached_blurb_html = $3,
    cached_headline = $4,
    cached_subheadline = $5,
    cached_body_html = $6,
    annotations_count = $7,
    groomed_at = NOW()
  WHERE id = $1
`;

type updateTextValues = [
  number,
  string,
  string,
  string,
  string,
  string,
  number
];

const runSql = async (sql: string, values?: updateTextValues) => {
  try {
    const results = await client.query(sql, values);
    return results.rows;
  } catch (error) {
    console.log(error.stack);
  }
};

const updateText = (note: Note) => {
  console.log("Updating ", chalk.black.bgYellow(note.title), "...");

  let text = "";
  const parser = new htmlparser2.Parser(
    {
      onopentag(tagName: string, attributes: Attributes) {
        console.log(
          chalk.black.bgCyan(tagName),
          chalk.magenta(JSON.stringify(attributes))
        );
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
        if (config.ALLOWED_TAGS.concat("a").includes(tagName)) {
          text = text.concat("</span>");
        }
        if (["a", "ol", "ul", "li", "table", "tr", "td"].includes(tagName)) {
          text = text.concat(`</${tagName}>`);
        }
      },
    },
    { decodeEntities: true }
  );

  parser.write(note.body.slice(0, note.body.indexOf("--30--")));
  parser.end();

  // SECTIONS & PARAGRAPHS
  text = text
    .replace(/[\n]+/gm, "\n")
    .split(/\n/)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
  text = `<section>${text}</section>`;

  const replacements = {
    nestedAnnotations: {
      name: "Fix nested annotations",
      find: new RegExp(/(\[[^\]]*)\[([^\]]*)\]([^\[]*\])/, "gm"),
      replace: "$1$3",
    },
  };

  // ANNOTATIONS
  const annotationPattern = new RegExp(/\s*( *\[)([^\.].*? .*?)(\])/, "gm");
  const nestedAnnotationPattern = new RegExp(
    /(\[[^\]]*)\[([^\]]*)\]([^\[]*\])/,
    "gm"
  );
  const cleanOrphanedAnnotations = new RegExp(
    /<\/p><p><a class="annotation-mark/,
    "gm"
  );
  const cleanTerminalAnnotations = new RegExp(
    /([\.\,\;\:])(<a class="annotation-mark)/,
    "gm"
  );
  const cleanTerminalAnnotations2 = new RegExp(
    /<a (class="annotation-mark.*?a>)([\.\,\;\:])/,
    "gm"
  );
  const trimTextOpen = new RegExp(/>\s*/, "gm");
  const trimTextClose = new RegExp(/\s*</, "gm");
  const trimDoubleSpace = new RegExp(/  +/, "gm");

  text = text.replace(nestedAnnotationPattern, "$1$3");

  let annotationsIndex = 0;
  let annotations: Array<string> = [];
  text = text.replace(annotationPattern, (match: string) => {
    // annotations[annotationsIndex] = match.match(/\[(.*?)\]/)[1];
    annotationsIndex = annotationsIndex + 1;
    return `<a class="annotation-mark">${annotationsIndex}</a>`;
  });

  console.log(chalk.black.bgYellow(annotations.join()));

  text = text.replace(
    cleanOrphanedAnnotations,
    '<a class="annotation-mark" href="#annotation'
  );
  text = text.replace(
    cleanTerminalAnnotations,
    '$1<a class="annotation-mark squash" href="#annotation'
  );
  text = text.replace(
    cleanTerminalAnnotations2,
    '$2<a class="annotation-mark squash" $1'
  );
  text = text.replace(trimTextOpen, ">");
  text = text.replace(trimTextClose, "<");
  text = text.replace(trimDoubleSpace, " ");

  text = text.replace(/<p>{quote:(.*?)}<\/p>/gm, "<blockquote>$1</blockquote>");
  text = text.replace(/<p>[\*]+<\/p>/gm, "</section><section>");
  text = text.replace(/<p><\/p>\n?/gm, "");
  text = text.replace(/a>(\w)/gm, "a> $1");
  text = text.replace(/\s* <\//gm, "</");

  text = pretty(text, { ocd: true });

  text = text.replace(/classname/gim, "class");

  console.log(chalk.red(text.replace(/\u00AD/g, "~")));
  Object.keys(note)
    .sort()
    .forEach((key) => console.log(chalk.magenta(key)));

  const cachedUrl = `/texts/${note.id}`;

  const splitTitle = note.title.split(":");
  const cachedBlurbHtml = `<h4>${clean(note.title)}</h4>`;
  const cachedHeadline = clean(splitTitle[0]);
  const cachedSubheadline = splitTitle[1] ? clean(splitTitle[1]) : null;
  const cachedBodyHtml = `
    <section class="body">${text}</section>
    <section id="annotations">
      <header><h3>Annotations</h3></header>
      <ol class="annotations-container">
      ${annotations
        .map((annotation) => `<li class="annotation">${annotation}</li>`)
        .join("")}
      </ol>
    </section>
  `;

  runSql(updateTextSql, [
    note.id,
    cachedUrl,
    cachedBlurbHtml,
    cachedHeadline,
    cachedSubheadline,
    cachedBodyHtml,
    annotations.length,
  ]).then(() => console.log(`Updated note ${note.id}: ${note.title}`));
};

runSql(selectSql)
  .then((rows: Array<Note>) =>
    rows.length
      ? rows.forEach(updateText)
      : console.log(chalk.bold.red("Nothing found!"))
  )
  .then(() => {
    client.end();
    process.exit();
  });

// runSql(selectSql)
//   .then((rows: Array<Note>) => {
//     if (rows.length) {
//       rows.forEach(updateText);
//       return console.log(chalk.bold.green(`${rows.length} texts updated!`));
//     }
//     return console.log(chalk.bold.red("Nothing found!"));
//   })
//   .then(() => {
//     client.end();
//     process.exit();
//   });
