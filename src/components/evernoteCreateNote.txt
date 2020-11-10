export {};

module.exports = (noteStore: EvernoteNoteStore, noteBody: string, parentNotebook?: EvernoteNotebook, noteTitle?: string) => {
  const nBody = `<?xml version="1.0" encoding="UTF-8"?>
                  <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
                  <en-note>${noteBody}</en-note>`;

  let ourNote = new Evernote.Types.Note();
  ourNote.title = noteTitle;
  ourNote.content = nBody;
  
  // If omitted, default notebook is used
  if (parentNotebook && parentNotebook.guid) {
    ourNote.notebookGuid = parentNotebook.guid;
  }
  
  noteStore.createNote(ourNote).then(function(note: EvernoteNote) {
    console.log(note);
  }).catch(function (err: string) {
    console.error(err, 'http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode');
  });
}
