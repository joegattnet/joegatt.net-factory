export {};

const chalk = require("chalk");
const flow = require("lodash/fp/flow");
const pretty = require("pretty");

const { Client } = require("pg");

const config = require("../config");
// const delink = require("../components/delink");
const dequote = require("../components/dequote");
// const link = require("../components/link");
const parse = require("../components/parse");
const sanitise = require("../components/sanitise");
const thirty = require("../components/thirty");
// const truncate = require("../components/truncate");
const tidyHtml = require("../components/tidyHtml");

const client = new Client(config.DB_CONNECTION);
client.connect();

const selectTextsSql = `
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

const fetchTexts = async () => {
  const results = await client.query(selectTextsSql);
  return results.rows;
};

const formatText = (note: Note) => {
  let text = flow(sanitise, thirty, dequote, parse)(note.body);

  // SECTIONS & PARAGRAPHS
  text = text
    .replace(/[\n]+/gm, "\n")
    .split(/\n/)
    .map((paragraph: String) => `<p>${paragraph}</p>`)
    .join("");
  text = `<section>${text}</section>`;

  // const replacements = {
  //   nestedAnnotations: {
  //     name: "Fix nested annotations",
  //     find: new RegExp(/(\[[^\]]*)\[([^\]]*)\]([^\[]*\])/, "gm"),
  //     replace: "$1$3",
  //   },
  // };

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

  // Needs to be different if this is a feature, etc
  const path = `/texts/${note.id}`;

  const splitTitle = note.title.split(":");
  const blurb = tidyHtml(`<h4>${clean(note.title)}</h4>`);

  const headline = clean(splitTitle[0]);
  const subheadline = splitTitle[1] ? clean(splitTitle[1]) : null;
  const body = tidyHtml(`
    <section class="body">${text}</section>
    <section id="annotations">
      <header><h3>Annotations</h3></header>
      <ol class="annotations-container">
      ${annotations
        .map((annotation) => `<li class="annotation">${annotation}</li>`)
        .join("")}
      </ol>
    </section>
  `);

  return {
    id: note.id,
    path: path,
    blurb: blurb.trim(),
    body: body.trim(),
    headline: headline.trim(),
    subheadline: subheadline.trim(),
    annotationsCount: annotations.length,
  };
};

const updateText = async (values: UpdateTextValues) => {
  const result = await client.query(updateTextSql, [
    values.id,
    values.path,
    values.blurb,
    values.body,
    values.headline,
    values.subheadline,
    values.annotationsCount,
  ]);
  return result;
};

const updateAllTexts = async () => {
  try {
    const texts = await fetchTexts();
    await Promise.all(
      texts.map(async (text: Note) => {
        const formattedText = formatText(text);
        const result = await updateText(formattedText);
        return result.rowCount;
      })
    );
    return `Updated ${texts.length} texts!`;
  } catch (error) {
    return `Updating texts failed: ${error}`;
  }

  client.end();
  process.exit();
};

module.exports = { formatText, updateAllTexts };
