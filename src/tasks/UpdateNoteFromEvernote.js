// https://slack.dev/node-slack-sdk/web-api

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const path = require('path');
const parameterize = require('parameterize');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  if (!process.env.EVERNOTE_TOKEN) {
    console.error('Evernote token missing! Get one from https://dev.evernote.com/get-token/');
  }
}

updateNoteFromEvernote();

/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
 */

/******************************************************************************
                                  EVERNOTE
 ******************************************************************************/

  var Evernote = require('evernote');

  function updateNote(noteStore, guid, noteTitle, noteBody, parentNotebook) {
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


 const updateOrCreateNote = () => {
   
 }

 function updateNoteFromEvernote() {
    const note = getEvernoteNote(noteStore, text.evernoteId, res.data.title, bodyText);

    updateNote(noteStore, text.evernoteId, res.data.title, bodyText);
  });
}
