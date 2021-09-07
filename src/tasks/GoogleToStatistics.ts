// https://slack.dev/node-slack-sdk/web-api

import fs from 'fs';
import path from 'path';
const googleDocsAuthorize = require('../components/googleDocsAuthorize'); // CHANGE TO IMPORT!!!
const googleToStatistics = require('../components/googleToStatistics');
const CREDENTIALS_PATH = path.resolve(__dirname, '../../googledocs.credentials.json');

export {};

module.exports = (googleDocsId: string) => {
  // console.log('Running GoogleToStatistics...');
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    return googleDocsAuthorize(JSON.parse(content.toString()), googleToStatistics, { googleDocsId });
  });
}
