// https://slack.dev/node-slack-sdk/web-api

import fs from 'fs';
import path from 'path';
const googleDocsAuthorize = require('../components/googleDocsAuthorize'); // CHANGE TO IMPORT!!!
const googleToEvernote = require('../components/googleToEvernote');
const CREDENTIALS_PATH = path.resolve(__dirname, '../../googledocs.credentials.json');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  if (!process.env.EVERNOTE_TOKEN) {
    console.error('Evernote token missing! Get one from https://dev.evernote.com/get-token/');
  }
}

export {};

module.exports = (googleDocsId: string, collate: boolean) => {
  console.log('Running GoogleToEvernote...');
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    googleDocsAuthorize(JSON.parse(content.toString()), googleToEvernote, { googleDocsId, collate });
  });
}
