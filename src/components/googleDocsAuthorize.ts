/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {GoogleCredentials} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */

import fs from 'fs';
import { google } from 'googleapis';
import path from 'path';

const TOKEN_PATH = path.resolve(__dirname, '../../googledocs.token.json');

export {};

module.exports = (credentials: GoogleCredentials, callback: Function) => {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    // if (err) return getNewToken(oAuth2Client, callback);
    // REVIEW: this cannot happen during API call
    oAuth2Client.setCredentials(JSON.parse(token.toString()));
    callback(oAuth2Client);
  });
};
