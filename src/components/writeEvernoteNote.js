// https://gist.github.com/evernotegists
// https://dev.evernote.com/doc/articles/creating_notes.php
// https://github.com/evernote/evernote-sdk-js

var Evernote = require('evernote');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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

// POC
updateNote(noteStore, '4d6bf3b8-0c94-44f1-a1fb-c0e37faf4213', 'JG Bizlejn dik', `<p>rajtha \'l badiddina? <strong>${process.argv[2]}</strong>?</p>`);
