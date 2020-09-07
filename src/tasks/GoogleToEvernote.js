// https://slack.dev/node-slack-sdk/web-api

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const path = require('path');
const parameterize = require('parameterize');
const md5 = require('md5');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  if (!process.env.EVERNOTE_TOKEN) {
    console.error('Evernote token missing! Get one from https://dev.evernote.com/get-token/');
  }
}

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/documents'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const CREDENTIALS_PATH = path.resolve(__dirname, '../../googledocs.credentials.json');
const TOKEN_PATH = path.resolve(__dirname, '../../googledocs.token.json');

// Load client secrets from a local file.
fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Docs API.
  authorize(JSON.parse(content), googleToEvernote);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

const formatFootnote = (footnoteId, footnotes) => {
  // REVIEW: Can we refactor this?
  const textArray = footnotes[footnoteId].content.map(chunk => {
    if (!chunk.paragraph) return null;
    return chunk.paragraph.elements.map(element => {
      if (element.textRun && element.textRun.textStyle.link) {
        return `<a href="${element.textRun.textStyle.link.url}">${element.textRun.content.trim()}</a>`;
      }
      if (element.textRun) return element.textRun.content.trim();
      if (element.footnoteReference) return formatFootnote(element.footnoteReference, data.footnotes);      
      return null;
    }).join(' ');
  });
  const textString = textArray.join('');
  textString.replace(/ +/gm, ' ');
  return `[${textString}]`;
}

const formatBody = data => {
  const textArray = data.body.content.map(chunk => {
    if (!chunk.paragraph) return null;
    if (chunk.paragraph.paragraphStyle.namedStyleType === 'TITLE') return null;
    if (chunk.paragraph.paragraphStyle.namedStyleType === 'HEADING_4') {
      const headingText = chunk.paragraph.elements[0].textRun.content.trim();
      return ['',`<strong>${headingText}</strong>`.replace(/\{\{\{\{/, '{{').replace(/\}\}\}\}/, '}}')];
    }
    if (chunk.paragraph.paragraphStyle.namedStyleType === 'HEADING_5') {
      const headingText = chunk.paragraph.elements[0].textRun.content.trim();
      if (headingText === '--30--' || headingText === '-30-') return headingText;
      return [' ',`{\{${headingText}\}\}`];
    }
    return chunk.paragraph.elements.map(element => {
      if (element.textRun && element.textRun.textStyle.link) {
        return `<a href="${element.textRun.textStyle.link.url}">${element.textRun.content.trim()}</a>`;
      }
      if (element.textRun) return element.textRun.content.trim();
      if (element.footnoteReference) return formatFootnote(element.footnoteReference.footnoteId, data.footnotes);      
      return null;
    }).join(' ');
  });
  const textString = textArray.flat().filter(Boolean).map(line => line && `<p>${line.replace(/\&/gm, '&amp;').replace(/\n\n\n+/gm, '\n\n').replace(/ +/gm, ' ')}</p>\n`).join('\n').trim();
  // textString.replace(/\n\n\n+/gm, '\n\n').replace(/ +/gm, ' ');
  // return textString.replace(/\n\n\n\n\{\{/gm, '\n\n\n{{').replace(/\}\}\n\n/gm, '}}\n').split('\n');
  return textString;
}

const formatBodyFromGoogleDoc = data => {
  // This is probably temporary since we will want the permanent one to do this conversion from Evernote format
  const textArray = data.body.content.map(chunk => {
    if (!chunk.paragraph) return null;
    if (chunk.paragraph.paragraphStyle.namedStyleType === 'TITLE') return null;
    if (chunk.paragraph.paragraphStyle.namedStyleType === 'HEADING_4') return null;
    if (chunk.paragraph.paragraphStyle.namedStyleType === 'HEADING_5') return '\n';
    return chunk.paragraph.elements.map(element => {
      if (element.textRun && element.textRun.textStyle.link) {
        return `<a href="${element.textRun.textStyle.link.url}">${element.textRun.content.trim()}</a>`;
      }
      if (element.textRun) return element.textRun.content.trim();
      if (element.footnoteReference) return null;
      return null;
    }).join(' ');
  });
  const textString = textArray.flat().filter(Boolean).map(line => line && `${line.replace(/\&/gm, '&amp;').replace(/\n\n\n+/gm, '\n\n').replace(/ +/gm, ' ')}\n`).join('').trim();
  return textString.replace(/\n\n\n\t/gm, '\n\n\n');
}

let chapters = [
  {
    evernoteId: '4d6bf3b8-0c94-44f1-a1fb-c0e37faf4213',
    googleDocumentId: '1mhAQIzBflcx_jxIejYOrfWWgEnjCD6Kpa9eTxFTFdF0',
    googleDocumentIdNoAnnotations: '1HIOXwiF1Zm2-PpUrYlvM_S7NjUjA45IgxHaf3KkeC_k',
    name: 'Example',
  },
  {
    googleDocumentId: '1Hw83EEy5rPZXhpWHAvZTS4rPOU7Evyyr1lWwOHB_Y2M',
    googleDocumentIdNoAnnotations: '1HIOXwiF1Zm2-PpUrYlvM_S7NjUjA45IgxHaf3KkeC_k',
    evernoteId: 'bdaab182-b0fd-4341-b14c-caccf1398e75',
    name: 'Chapter 1',
  }, 
  {
    googleDocumentId: '17dBUrOnwO-4c6QQM9UyfiUI1CBfV0jPPB1aQn9sbMt4',
    googleDocumentIdNoAnnotations: '1HIOXwiF1Zm2-PpUrYlvM_S7NjUjA45IgxHaf3KkeC_k',
    evernoteId: 'b294b6a5-a561-465a-85b7-8a692b21225e',
    name: 'Chapter 2',
  },
  {
    googleDocumentId: '1j0j8EHzrk06cadp56yyLgBJ1gbJ54_DWPdcVJV2GWi8',
    googleDocumentIdNoAnnotations: '1HIOXwiF1Zm2-PpUrYlvM_S7NjUjA45IgxHaf3KkeC_k',
    evernoteId: '4d7f9c6d-287a-4847-9cfd-1b4fda7c3a41',
    name: 'Chapter 3',
  },
  {
    evernoteId: '3c596fe9-d166-4c69-bc9a-ca5ec1cb9888',
    googleDocumentId: '13LhjdMQiQvQJfqy9EhcIICp5Zmp06hnjqRoDCC1shNI',
    googleDocumentIdNoAnnotations: '1HIOXwiF1Zm2-PpUrYlvM_S7NjUjA45IgxHaf3KkeC_k',
    name: 'Chapter 4',
  },
  {
    googleDocumentId: '1BsLoH3GnAWUMss04IcTxPQZkbv0suV3zuYg5r7ZHXgY',
    googleDocumentIdNoAnnotations: '1HIOXwiF1Zm2-PpUrYlvM_S7NjUjA45IgxHaf3KkeC_k',
    evernoteId: 'c967e410-ebdb-4de8-aade-9f7b683e83e7',
    name: 'Chapter 5'
  },
  { name: 'Chapter 6', googleDocumentId:'', evernoteId: '0a56703b-f884-4a13-901d-a4cb81d55c90' }
];

chapters[100] = {
  googleDocumentId: '1y49ohNV8tMnHl07Esuw2kgiCXqidmXbTbe3sGGqwSmg',
  googleDocumentIdNoAnnotations: '1FKZIfZabCPdksBFFVhxS9M1CRBXf44c57YkCS7-ezh8',
  evernoteId: '18b66cf9-93ac-4fde-91cc-93e1571e27fe',
  name: 'Qatel 0'
};

chapters[101] = {
  googleDocumentId: '1cPOzhm-0FfryD5uJQ_RBMYNIKr7QYVpj-6K28I6WCHE',
  googleDocumentIdNoAnnotations: '1FKZIfZabCPdksBFFVhxS9M1CRBXf44c57YkCS7-ezh8',
  evernoteId: 'c967e410-ebdb-4de8-aade-9f7b683e83e7',
  name: 'Qatel 1'
};

chapters[102] = {
  googleDocumentId: '1JYDHsmJyIZ-WXj7xceP0ZimBJ62s4KHHz_Ed44SQCYE',
  googleDocumentIdNoAnnotations: '1FKZIfZabCPdksBFFVhxS9M1CRBXf44c57YkCS7-ezh8',
  evernoteId: 'c967e410-ebdb-4de8-aade-9f7b683e83e7',
  name: 'Qatel 2'
};

chapters[1001] = {
  googleDocumentId: '1BsLoH3GnAWUMss04IcTxPQZkbv0suV3zuYg5r7ZHXgY',
  googleDocumentIdNoAnnotations: '1FKZIfZabCPdksBFFVhxS9M1CRBXf44c57YkCS7-ezh8',
  evernoteId: 'c967e410-ebdb-4de8-aade-9f7b683e83e7',
  name: 'Political 1'
};

/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
 */

/******************************************************************************
                                  EVERNOTE
 ******************************************************************************/

  var Evernote = require('evernote');

  function updateEvernoteNote(noteStore, guid, noteTitle, noteBody, parentNotebook) {
    var nBody = '<?xml version="1.0" encoding="UTF-8"?>';
    nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
    nBody += "<en-note>" + noteBody + "</en-note>";
   
    // Create note object
    var ourNote = new Evernote.Types.Note();
    ourNote.guid = guid;
    ourNote.title = noteTitle;
    ourNote.content = nBody;
   
    // parentNotebook is optional; if omitted, default notebook is used
    if (parentNotebook && parentNotebook.guid) {
      ourNote.notebookGuid = parentNotebook.guid;
    }
   
    // Attempt to create note in Evernote account (returns a Promise)
    noteStore.updateNote(ourNote)
      .then(function(note) {
        // Do something with `note`
        console.log(note);
      }).catch(function (err) {
        // Something was wrong with the note data
        // See EDAMErrorCode enumeration for error code explanation
        // http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
        console.log(err);
      });
  }

  // var client = new Evernote.Client(token: token);
  // If we didn't have token we would have to fetch it now
  const TOKEN = process.env.EVERNOTE_TOKEN;
  var client = new Evernote.Client({
    token: TOKEN,
    sandbox: false,
    china: false
  });
  var noteStore = client.getNoteStore();


 /*****************************************************************************/

 function googleToEvernote(auth) {
  const docs = google.docs({version: 'v1', auth});
  const text = chapters[parseInt(process.argv[2], 10)];
  docs.documents.get({
    documentId: text.googleDocumentId,
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const documentTitle = res.data.title;
    const bodyText = formatBody(res.data);

    docs.documents.batchUpdate({
      documentId: text.googleDocumentIdNoAnnotations,
      requestBody: {
        requests: [
          {
            insertText: {
              location: {
                index: 1
              },
              text: formatBodyFromGoogleDoc(res.data)
            }
          }
        ]
      }
    });

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
        console.log(`Content stored to ${fileName}`);
      });
      updateEvernoteNote(noteStore, text.evernoteId, documentTitle, bodyText);
    });
  });
}
