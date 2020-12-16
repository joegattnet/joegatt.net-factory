import * as Evernote from 'evernote';
import fs from 'fs';
import { google } from 'googleapis';
import md5 from 'md5';
import parameterize from 'parameterize';
import path from 'path';

const googleDocsFormatBody = require('./googleDocsFormatBody');
const updateEvernoteNote = require('./evernoteUpdateNote');

const TOKEN = process.env.EVERNOTE_TOKEN;
const client = new Evernote.Client({
  token: TOKEN,
  sandbox: false,
  china: false
});
var noteStore = client.getNoteStore();

let slackBotToken = process.env.SLACK_BOT_TOKEN
let Slack = require('slack')
let bot = new Slack({slackBotToken})

export {};

module.exports = (auth: string) => {
  const docs = google.docs({version: 'v1', auth});

  // Needs drive permissions - use browser sample
  // const drive = google.drive({ version: 'v3', auth });
  // drive.files.list({}, (err, res) => {
  //   if (err) throw err;
  //   const files = res.data.files;
  //   if (files.length) {
  //   files.map((file) => {
  //     console.log(file);
  //   });
  //   } else {
  //     console.log('No files found');
  //   }
  // });

  const text = chapters[parseInt(process.argv[2], 10)];
  docs.documents.get({
    documentId: text.googleDocumentId,
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    if (!res || !res.data) return console.log('Response is empty!');
    // https://www.googleapis.com/drive/v2/files/
    // console.log(res);
    const documentTitle = res.data.title || 'Untitled';
    const bodyText = googleDocsFormatBody(res.data);

    // docs.documents.batchUpdate({
    //   documentId: text.googleDocumentIdNoAnnotations,
    //   requestBody: {
    //     requests: [
    //       {
    //         insertText: {
    //           location: {
    //             index: 1
    //           },
    //           text: googleDocsFormatBodyFromGoogleDoc(res.data)
    //         }
    //       }
    //     ]
    //   }
    // });

    const contentHash = md5(`${documentTitle}${bodyText}`)
    const fileName = `${parameterize(documentTitle)}|${text.evernoteId}|${Date.now()}|${contentHash}.txt`;
    const filePath = path.resolve(__dirname, `../../content/${fileName}`);  

    fs.readdir(path.resolve(__dirname, `../../content`), (err, items) => {
      if (err) return console.error(err);
      const alreadySaved = items.some(item => {
        const [, guid, , hash] = item.split(/\||\./);
        return (guid === text.evernoteId && hash === contentHash);
      });
      if (alreadySaved) return console.log(`${documentTitle} has not changed. Not saving!`);

      fs.writeFile(filePath, bodyText, (err) => {
        if (err) return console.error(err);
        const message = `Content stored to ${fileName}`;
        const shorterMessage = `${parameterize(documentTitle)} saved from Google doc.`;
        console.log(message);
        ;(async function main() {
          // logs {args:{hyper:'card'}}
          var result = await bot.chat.postMessage({channel: 'events', text: shorterMessage});
          console.log(result)
        })()
      });
      updateEvernoteNote(noteStore, text.evernoteId, bodyText, documentTitle);
    });
  });
};
