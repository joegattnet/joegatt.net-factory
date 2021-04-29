/**
 * Get Google Doc and update Evernote.
 *
 * @param {string} auth GoogleDocs auth.
 * @param {string} params GoogleDocsParams object.
 */

import * as Evernote from 'evernote';
import * as dotenv from 'dotenv';

import { google } from 'googleapis';

dotenv.config();

const googleDocsParseBody = require('./googleDocsParseBody');
const evernoteUpdateNote = require('./evernoteUpdateNote');

const TOKEN = process.env.EVERNOTE_TOKEN;

const client = new Evernote.Client({
  token: TOKEN,
  sandbox: false,
  china: false
});
const noteStore = client.getNoteStore();

const Slack = require('slack');
const slackBotToken = process.env.SLACK_BOT_TOKEN;
const slackBot = new Slack({token: slackBotToken});

export {};

module.exports = (auth: string, params: GoogleDocsParams) => {
  const docs = google.docs({version: 'v1', auth});

  // Needs drive permissions - use browser sample
  if (params.collate) {
    // const drive = google.drive({ version: 'v3', auth });
    // drive.files.list({}, (err, res) => {
    //   if (err) throw err;
    //   const files = res && res.data.files;
    //   if (files && files.length) {
    //   files.map((file) => {
    //     console.log(file);
    //   });
    //   } else {
    //     console.log('No files found');
    //   }
    // });
  }

  docs.documents.get({
    documentId: params.googleDocsId,
  }, (err: any, res: any) => {
    if (err) return console.error('The API returned an error: ' + err);
    if (!res || !res.data) return console.error('Response is empty!');
    // https://www.googleapis.com/drive/v2/files/
    // console.log(res);
    const documentTitle = res.data.title || 'Untitled';
    const { bodyText, evernoteId } = googleDocsParseBody(res.data);
    if (!evernoteId) return console.error('Evernote Id not found!');

    if (params.collate) {
      // docs.documents.batchUpdate({
      //   documentId: googleDocsCollatedId,
      //   requestBody: {
      //     requests: [
      //       {
      //         insertText: {
      //           location: {
      //             index: 1
      //           },
      //           text: bodyText
      //         }
      //       }
      //     ]
      //   }
      // });
    }

    const googleLink = `https://docs.google.com/document/d/${params.googleDocsId}/edit#`;
    const evernoteLink = `https://www.evernote.com/Home.action?login=true#n=${evernoteId}&s=s8&ses=4&sh=2&sds=5&`;

    const shorterMessage = `"${documentTitle}" saved from <${googleLink}|Google> to <${evernoteLink}|Evernote>.`;
    ;(async function main() {
      // logs {args:{hyper:'card'}}
      await slackBot.chat.postMessage({channel: 'events', text: shorterMessage});
    })();

    evernoteUpdateNote(noteStore, evernoteId, bodyText, documentTitle, googleLink);
  });
};
