// https://gist.github.com/evernotegists
// https://dev.evernote.com/doc/articles/creating_notes.php
// https://github.com/evernote/evernote-sdk-js

var Evernote = require('evernote');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

function updateNote(noteStore: EvernoteNoteStore, guid: string, noteTitle: string, noteBody: string, parentNotebook?: EvernoteNotebook) {
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
 
  noteStore.updateNote(ourNote)
    .then(function(note: EvernoteNote) {
      console.log(note);
    }).catch(function (err:string) {
      console.log(err, 'http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode');
    });
}
