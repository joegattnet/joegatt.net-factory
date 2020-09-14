

const TOKEN: string = process.env.EVERNOTE_TOKEN;
var client = new Evernote.Client({
  token: TOKEN,
  sandbox: false,
  china: false
});
var noteStore = client.getNoteStore();