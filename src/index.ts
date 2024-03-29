import express from 'express';
import { Request, Response, } from 'express';
const port = 3000;

const googleToEvernote = require('./tasks/GoogleToEvernote.js');
const googleToStatistics = require('./tasks/GoogleToStatistics.js');
const googleToStanza = require('./tasks/GoogleToStanza.js');
const pingDatabase = require('./tasks/PingDatabase.js');
const pingTypescript = require('./tasks/PingTypescript.js');

const { updateAllCitations } = require("./tasks/citations");
const { updateAllTexts } = require("./tasks/texts");

const dev = process.env.NODE_ENV !== 'production';
const evernoteNotebooks = process.env.EVERNOTE_NOTEBOOKS && process.env.EVERNOTE_NOTEBOOKS.split(',');
const log4js = require('log4js');
const logger = log4js.getLogger();
const loggerLevel = dev ? 'warn' : 'warn';
const logAppender = dev ? 'slack' : 'slack';

const asyncHandler = (func: any) => (req: Request, res: Response, next: any) => {
  Promise.resolve(func(req, res, next))
    .catch(next)
}

if (!evernoteNotebooks) {
  throw new Error('ERROR: EVERNOTE_NOTEBOOKS as environment variable is missing!');
}

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

const app = express();

app.use(log4js.connectLogger(logger, { level: loggerLevel }));

app.get('/', ( req, res ) => {
  res.send("Hello world!");
});

app.get('/stanza', (req, res) => {
  if (req.query.googleDocsId) {
    res.status(202).send('Accepted');
    googleToStanza(req.query.googleDocsId);
  } else {
    res.status(403).send('Bad request');
  }
});

app.get('/stats', (req, res) => {
  if (req.query.googleDocsId)
    return res.status(200).send(googleToStatistics(req.query.googleDocsId));
  res.status(403).send('Bad request');
});

// app.get('/pings/database', (req, res) => {
//   const response = pingDatabase();
//   res.status(200).send(response.toString());
//   // if (req.query.googleDocsId) {
//   //   res.status(200).send(response);
//   //   googleToStatistics(req.query.googleDocsId);
//   // } else {
//   //   res.status(424).send('Database query failed');
//   // }
// });

app.get('/pings/database', asyncHandler(async (req: Request, res: Response) => {
  const response = await Promise.all([
    pingDatabase()
  ])

  return res.send(response)
}));

app.get('/pings/typescript', (req, res) => {
  const response = pingTypescript();
  if (response === 'Ping Typescript OK') {
    logger.info('Pinged typescript OK');
    return res.status(200).send(response);
  }
  logger.info('Pinged typescript FAILED');
  res.status(424).send('Typescript failed');
});

app.get('/webhooks/evernoteNoteUpdated', (req, res) => {
  if (!req.query.guid || !req.query.notebookGuid)
    return res.status(403).send('Bad request');
  if (req.query.reason !== 'update' || !evernoteNotebooks.includes(req.query.notebookGuid.toString()))
    return res.status(422).send('Unprocessable entity');
  res.status(202).send('Accepted');
  // googleToEvernote(req.query.guid);
});

app.get('/webhooks/googleDocUpdated', (req, res) => {
  if (req.query.googleDocsId) {
    res.status(202).send('202: Accepted');
    googleToEvernote(req.query.googleDocsId);
  } else {
    res.status(403).send('Bad request');
  }
});

app.get('/webhooks/updateAllCitations', (req, res) => {
  const response = updateAllCitations();
  if (response)
    return res.status(200).send(response);
    res.status(500).send('500: Internal Server Error');
  });

app.get('/webhooks/updateAllTexts', (req, res) => {
  const response = updateAllTexts();
  if (response)
    return res.status(200).send(response);
  res.status(500).send('500: Internal Server Error');
});

app.use(function(req, res, next) {
  res.status(404).send('404: File Not Found');
});

app.listen(port, () => {
    logger.info(`Server started at http://localhost:${ port } (${ process.env.NODE_ENV })`);
});
