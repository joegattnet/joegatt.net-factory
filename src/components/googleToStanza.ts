/**
 * Get Google Doc and update Evernote.
 *
 * @param {string} auth GoogleDocs auth.
 * @param {string} params GoogleDocsParams object.
 */

import * as dotenv from 'dotenv';

import { google } from 'googleapis';

dotenv.config();

const googleDocsParsePlaintext = require('./googleDocsParsePlaintext');

const syllablesPerLine = 10;

const Slack = require('slack');
const slackBotToken = process.env.SLACK_BOT_TOKEN;
const slackBot = new Slack({token: slackBotToken});

export {};

module.exports = (auth: string, params: GoogleDocsParams) => {
  const docs = google.docs({version: 'v1', auth});

  if (params.collate) {
    const drive = google.drive({ version: 'v3', auth });
    drive.files.list({}, (err, res) => {
      if (err) throw err;
      const files = res && res.data.files;
      if (files && files.length) {
      files.map((file) => {
        console.log(file);
      });
      } else {
        console.log('No files found');
      }
    });
  }

  docs.documents.get({
    documentId: params.googleDocsId,
  }, (err: any, res: any) => {
    if (err) return console.error('The API returned an error: ' + err);
    if (!res || !res.data) return console.error('Response is empty!');
    // https://www.googleapis.com/drive/v2/files/
    // console.log(res);
    const documentTitle = res.data.title || 'Untitled';
    const { bodyText } = googleDocsParsePlaintext(res.data);
    const processedText = 'XXX';
    console.log(processedText);

    if (params.collate) {
      docs.documents.batchUpdate({
        documentId: params.googleDocsId,
        requestBody: {
          requests: [
            {
              insertText: {
                location: {
                  index: 1
                },
                text: `${processedText}\n\n${bodyText}`
              }
            }
          ]
        }
      });
    }

    const shorterMessage = `"${documentTitle}" split into verses of c. ${syllablesPerLine}.`;
    ;(async function main() {
      // logs {args:{hyper:'card'}}
      await slackBot.chat.postMessage({channel: 'events', text: shorterMessage});
    })();
  });
};
