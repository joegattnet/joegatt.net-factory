/**
 * Get Google Doc and update Evernote.
 *
 * @param {string} auth GoogleDocs auth.
 * @param {string} params GoogleDocsParams object.
 */

import * as dotenv from 'dotenv';

import { google } from 'googleapis';
// import { datacatalog } from 'googleapis/build/src/apis/datacatalog';

dotenv.config();

const commonWordsThreshold = 2000;
const frequencyThreshold = 3;

const googleDocsParsePlaintext = require('./googleDocsParsePlaintext');
const { getWordsList } = require('most-common-words-by-language');
const commonWords = getWordsList('english', commonWordsThreshold);

export {};

module.exports = (auth: string, params: GoogleDocsParams) => {
  const docs = google.docs({version: 'v1', auth});

  const getDocumentData = (googleDocsId: string): any => {
    return docs.documents.get({
      documentId: googleDocsId,
    }, (err: any, res: any) => {
      if (err) return console.error('The API returned an error: ' + err);
      if (!res || !res.data) return console.error('Response is empty!');
      console.log('>>>>>>>>>>>>>>>', res.data);
      // return res.data;
      return 'YYYYYYYYYYYYYYYYYY';
    }
  )};

  const getVocab = (plainText: string) => {
    var pattern = /[a-zA-Z'’-]+/g,
      matchedWords = plainText.toLocaleLowerCase().match(pattern);
    if (!matchedWords) return null;
    var counts = matchedWords.reduce((stats: Vocabulary, word: keyof Vocabulary) => {
          if (stats.hasOwnProperty(word) ) {
            stats[word] = stats[word] + 1;
        } else {
          if (!commonWords.includes(word)) {
            stats[word] = 1;
          };
        }
        return stats;
    }, {} );
    return Object.fromEntries(Object.entries(counts).filter(([,a]) => a >= frequencyThreshold).sort(([,a],[,b]) => b - a));
  };

  const documentData = getDocumentData(params.googleDocsId);
  // const documentTitle = documentData.title || 'Untitled';
  const bodyText = googleDocsParsePlaintext(documentData);
  const vocabulary = getVocab(bodyText);
  console.table(vocabulary);
  return vocabulary;
};
