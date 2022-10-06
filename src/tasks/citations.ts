import { Logger } from "log4js";

export {};

const chalk = require("chalk");
const flow = require("lodash/fp/flow");
const { Client } = require("pg");

const byline = require("../components/byline");
const config = require("../config");
const delink = require("../components/delink");
const dequote = require("../components/dequote");
const link = require("../components/link");
const parse = require("../components/parse");
const sanitise = require("../components/sanitise");
const splitCitation = require("../components/splitCitation");
const thirty = require("../components/thirty");
const truncate = require("../components/truncate");
const tidyHtml = require("../components/tidyHtml");

// ****************************
const log4js = require('log4js');
const logger = log4js.getLogger();
const loggerLevel = 'trace';
const logAppender = 'slack';
console.log = (msg) => logger.trace(msg);

console.log('testing citations!');

log4js.configure({
  appenders: {
    slack: {
      type: '@log4js-node/slack',
      layout: { type: 'messagePassThrough' },
      token: process.env.SLACK_BOT_TOKEN,
      channel_id: 'factory-logs',
      user_name: 'joegattnet-factory'
    },
    console: {
      layout: { type: 'coloured' },
      app: 'joegatt.net-factory',
      type: 'stdout',
      fields: {
        env: process.env.NODE_ENV,
        app_name: 'joegatt.net-factory'
      }
    }
  },
  categories: {
    default: { appenders: [logAppender], level: loggerLevel }
  }
});
// ****************************

const client = new Client(config.DB_CONNECTION);
client.connect();

const selectCitationsSql = `
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
    cached_body_html = $4,
    cached_source_html = '<div>IS THIS NECESSARY?</div>',
    groomed_at = NOW()
  WHERE id = $1
`;

const fetchCitations = async () => {
  const results = await client.query(selectCitationsSql);
  return results.rows;
};

const formatCitation = (note: Note): UpdateCitationValues => {
  let text = flow(sanitise, thirty, dequote)(note.body);
  let { citationText, attribution } = splitCitation(text);

  const blurbText = flow(truncate)(citationText);
  const blurbAttribution = flow(byline, delink)(attribution);
  const bodyText = parse(citationText);
  const bodyAttribution = flow(delink, byline, link)(attribution);

  const path = `/citations/${note.id}`;
  const blurb = tidyHtml(`
    <figure class="citation">
      <blockquote>YY-SANITYTEST-YY${blurbText}</blockquote>
      <figcaption>YY-SANITYTEST-YY${blurbAttribution}</figcaption>
    </figure>
  `);
  const body = tidyHtml(`
    <figure class="citation">
      <blockquote>XX-SANITYTEST-XX${bodyText}</blockquote>
      <figcaption>XX-SANITYTEST-XX${bodyAttribution}</figcaption>
    </figure>
  `);

  return {
    id: note.id,
    path: path,
    blurb: blurb.trim(),
    body: body.trim(),
  };
};

const updateCitation = async (values: UpdateCitationValues) => {
  const result = await client.query(updateCitationSql, [
    values.id,
    values.path,
    values.blurb,
    values.body,
  ]);
  return result;
};

const updateAllCitations = async () => {
  logger.info(`Running!`);
  try {
    const citations = await fetchCitations();
    logger.info(`Found ${citations.length} citations!`);
    await Promise.all(
      citations.map(async (citation: Note) => {
        const formattedCitation = formatCitation(citation);
        const result = await updateCitation(formattedCitation);
        return result.rowCount;
      })
    );
    return `Updated ${citations.length} citations!`;
  } catch (error) {
    return `Updating citations failed: ${error}`;
  }


  client.end();
  process.exit();
};

module.exports = { formatCitation, updateAllCitations };
