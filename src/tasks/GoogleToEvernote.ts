// https://slack.dev/node-slack-sdk/web-api

import fs from 'fs';
import path from 'path';

const googleDocsAuthorize = require('../components/googleDocsAuthorize');
const googleToEvernote = require('../components/googleToEvernote');

const CREDENTIALS_PATH = path.resolve(__dirname, '../../googledocs.credentials.json');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  if (!process.env.EVERNOTE_TOKEN) {
    console.error('Evernote token missing! Get one from https://dev.evernote.com/get-token/');
  }
}

fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  googleDocsAuthorize(JSON.parse(content.toString()), googleToEvernote);
});

// const googleDocsFormatBodyFromGoogleDoc = data => {
//   // This is probably temporary since we will want the permanent one to do this conversion from Evernote format
//   const textArray = data.body.content.map(chunk => {
//     if (!chunk.paragraph) return null;
//     if (chunk.paragraph.paragraphStyle.namedStyleType === 'TITLE') return null;
//     if (chunk.paragraph.paragraphStyle.namedStyleType === 'HEADING_4') return null;
//     if (chunk.paragraph.paragraphStyle.namedStyleType === 'HEADING_5') return '\n';
//     return chunk.paragraph.elements.map(element => {
//       if (element.textRun && element.textRun.textStyle.link) {
//         return `<a href="${element.textRun.textStyle.link.url}">${element.textRun.content.trim()}</a>`;
//       }
//       if (element.textRun) return element.textRun.content.trim();
//       if (element.footnoteReference) return null;
//       return null;
//     }).join(' ');
//   });
//   const textString = textArray.flat().filter(Boolean).map(line => line && `${line.replace(/\&/gm, '&amp;').replace(/\n\n\n+/gm, '\n\n').replace(/ +/gm, ' ')}\n`).join('').trim();
//   return textString.replace(/\n\n\n\t/gm, '\n\n\n');
// }

let chapters = [
  {
    evernoteId: '4d6bf3b8-0c94-44f1-a1fb-c0e37faf4213',
    googleDocumentId: '1mhAQIzBflcx_jxIejYOrfWWgEnjCD6Kpa9eTxFTFdF0',
    googleDocumentIdNoAnnotations: '1TUu2WDm8_WR194h3Uu4rTTlJOzrO26gXy4HPh9Hekd4',
    name: 'Example',
  },
  {
    googleDocumentId: '1Hw83EEy5rPZXhpWHAvZTS4rPOU7Evyyr1lWwOHB_Y2M',
    googleDocumentIdNoAnnotations: '1TUu2WDm8_WR194h3Uu4rTTlJOzrO26gXy4HPh9Hekd4',
    evernoteId: 'bdaab182-b0fd-4341-b14c-caccf1398e75',
    name: 'Chapter 1',
  }, 
  {
    googleDocumentId: '17dBUrOnwO-4c6QQM9UyfiUI1CBfV0jPPB1aQn9sbMt4',
    googleDocumentIdNoAnnotations: '1TUu2WDm8_WR194h3Uu4rTTlJOzrO26gXy4HPh9Hekd4',
    evernoteId: 'b294b6a5-a561-465a-85b7-8a692b21225e',
    name: 'Chapter 2',
  },
  {
    googleDocumentId: '1j0j8EHzrk06cadp56yyLgBJ1gbJ54_DWPdcVJV2GWi8',
    googleDocumentIdNoAnnotations: '1TUu2WDm8_WR194h3Uu4rTTlJOzrO26gXy4HPh9Hekd4',
    evernoteId: '4d7f9c6d-287a-4847-9cfd-1b4fda7c3a41',
    name: 'Chapter 3',
  },
  {
    evernoteId: '3c596fe9-d166-4c69-bc9a-ca5ec1cb9888',
    googleDocumentId: '13LhjdMQiQvQJfqy9EhcIICp5Zmp06hnjqRoDCC1shNI',
    googleDocumentIdNoAnnotations: '1TUu2WDm8_WR194h3Uu4rTTlJOzrO26gXy4HPh9Hekd4',
    name: 'Chapter 4',
  },
  {
    googleDocumentId: '1BsLoH3GnAWUMss04IcTxPQZkbv0suV3zuYg5r7ZHXgY',
    googleDocumentIdNoAnnotations: '1TUu2WDm8_WR194h3Uu4rTTlJOzrO26gXy4HPh9Hekd4',
    evernoteId: 'c967e410-ebdb-4de8-aade-9f7b683e83e7',
    name: 'Chapter 5'
  },
  { 
    name: 'Chapter 6',
    googleDocumentId:'1BMepUF3b2Gf7SsLsj7fODc-Omb-fdYMntxvezIe_A_U',
    googleDocumentIdNoAnnotations: '1TUu2WDm8_WR194h3Uu4rTTlJOzrO26gXy4HPh9Hekd4',
    evernoteId: '0a56703b-f884-4a13-901d-a4cb81d55c90' 
  },
  { 
    name: 'Chapter 7',
    googleDocumentId:'1Y1gEufUswFM5qtNP_htIRij9io7l0Y823Sxc_g1S6uE',
    googleDocumentIdNoAnnotations: '1TUu2WDm8_WR194h3Uu4rTTlJOzrO26gXy4HPh9Hekd4',
    evernoteId: 'e011937f-ca8f-4fc5-8ed4-ecc937f83dc4' 
  }
];

chapters[100] = {
  googleDocumentId: '1y49ohNV8tMnHl07Esuw2kgiCXqidmXbTbe3sGGqwSmg',
  // googleDocumentIdNoAnnotations: '1FKZIfZabCPdksBFFVhxS9M1CRBXf44c57YkCS7-ezh8',
  googleDocumentIdNoAnnotations: '1yBXGV2iOmf4P2BF7B9HtiBYLFlwDsKx5Q4bY1XXMHYk',
  evernoteId: 'b199d513-5d44-433c-af67-d85256456582',
  name: 'Qatel 0'
};

chapters[101] = {
  googleDocumentId: '1cPOzhm-0FfryD5uJQ_RBMYNIKr7QYVpj-6K28I6WCHE',
  googleDocumentIdNoAnnotations: '1yBXGV2iOmf4P2BF7B9HtiBYLFlwDsKx5Q4bY1XXMHYk',
  evernoteId: '32c57cc6-2763-4e05-8db6-e9b417e98c23',
  name: 'Qatel 1'
};

chapters[102] = {
  googleDocumentId: '1JYDHsmJyIZ-WXj7xceP0ZimBJ62s4KHHz_Ed44SQCYE',
  googleDocumentIdNoAnnotations: '1yBXGV2iOmf4P2BF7B9HtiBYLFlwDsKx5Q4bY1XXMHYk',
  evernoteId: '71c4f3c5-84b7-479a-a9f1-f1420b291326',
  name: 'Qatel 2'
};

chapters[1001] = {
  googleDocumentId: '1rCoKcT6-TWAlcvP-etS6LSKbA10qwCTrWXMdBigBRCs',
  googleDocumentIdNoAnnotations: '1oLCCBnjdNA5vlFpVy5_2qMY63sFS5Ojz0eTpz9SjsLA',
  evernoteId: '30f3a555-f983-4089-9e90-a1c876f9818b',
  name: 'Political 1'
};
