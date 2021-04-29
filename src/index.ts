import express from 'express';
const port = 80;

const googleToEvernote = require('./tasks/GoogleToEvernote.js');
const googleToStatistics = require('./tasks/GoogleToStatistics.js');

const dev = process.env.NODE_ENV !== 'production';
const log4js = require('log4js');
const logger = log4js.getLogger();
const loggerLevel = dev ? 'debug' : 'debug';
const logAppender = dev ? 'console' : 'console';

log4js.configure({
  appenders: {
    console: {
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
  res.send( "Hello world!" );
});

app.get('/googleDocUpdated', (req, res) => {
  if (req.query.googleDocsId) {
    googleToEvernote(req.query.googleDocsId);
    res.status(202).send('Accepted');
  } else {
    res.status(403).send('Bad request');
  }
});

app.get('/stats', (req, res) => {
  if (req.query.googleDocsId) {
    googleToStatistics(req.query.googleDocsId);
    res.status(202).send('Accepted');
  } else {
    res.status(403).send('Bad request');
  }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${ port }`);
});
