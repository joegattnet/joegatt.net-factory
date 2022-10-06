export {};

const { Client } = require("pg");
const config = require("../config");

const client = new Client(config.DB_CONNECTION);
client.connect();

// ****************************
const log4js = require('log4js');
const loggerLevel = 'trace';
const logAppender = 'slack';

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
const logger = log4js.getLogger();
console.log = (msg) => logger.trace(msg);

// ****************************


const selectNoteSql = `
  SELECT id
  FROM notes
  WHERE lang = 'en'
  LIMIT 1
`;

const fetchNote = async () => {
  const results = await client.query(selectNoteSql);
  return results.rows;
};

const pingDatabase = async () => {
  console.log('console.log testing PingsDatabase!');
  try {
    const note = await fetchNote();
    console.log(note);
    return note.lang;
  } catch (error) {
    console.log('Query failed.');
  }

  client.end();
  process.exit();
};

module.exports = pingDatabase;
