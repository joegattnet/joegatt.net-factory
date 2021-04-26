import express from "express";
const app = express();
const port = 80;

const googleToEvernote = require('./tasks/GoogleToEvernote.js');
const googleToStatistics = require('./tasks/GoogleToStatistics.js');

// define a route handler for the default home page
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
