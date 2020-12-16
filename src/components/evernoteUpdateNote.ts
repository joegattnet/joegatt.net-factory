import * as Evernote from 'evernote';

/**
 * Update the note in Evernote.
 *
 * https://gist.github.com/evernotegists
 * https://dev.evernote.com/doc/articles/creating_notes.php
 * https://github.com/evernote/evernote-sdk-js
 *
 * @param {EvernoteNoteStore} noteStore Evernote note store.
 * @param {Evernote.Types.Guid} guid Evernote guid for this note.
 * @param {string} noteBody The note body.
 * @param {string} noteTitle The note title (optional).
 * @param {Evernote.Types.Notebook} parentNotebook The parent notebook (optional).
 */

export {};

module.exports = (
    noteStore: EvernoteNoteStore,
    guid: Evernote.Types.Guid,
    noteBody: string,
    noteTitle?: string,
    parentNotebook?: Evernote.Types.Notebook
  ) => {

  let nBody = '<?xml version="1.0" encoding="UTF-8"?>';
  nBody += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
  nBody += "<en-note>" + noteBody + "</en-note>";
  
  let ourNote = new Evernote.Types.Note();
  ourNote.guid = guid;
  ourNote.title = noteTitle;
  ourNote.content = nBody;
  
  if (parentNotebook && parentNotebook.guid) {
    ourNote.notebookGuid = parentNotebook.guid;
  }

  noteStore.updateNote(ourNote)
    .then(function(note: Evernote.Types.Note) {
      // Do something with `note`
      console.log(note);
    }).catch(function (err: string) {
      console.log(err, 'http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode');
    });
};
