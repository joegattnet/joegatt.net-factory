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

/******************************************************************************
                                  EVERNOTE
 ******************************************************************************/

  const Evernote = require('evernote');

  const getEvernoteNote = async (noteStore, evernoteId) => {
    const noteResultSpec = {
      includeContent: true,
      includeResourcesData: false,
      includeTagNames: true
    }
    const note = await noteStore.getNoteWithResultSpec(evernoteId, noteResultSpec);
    return note;
  }

   /*****************************************************************************/

  // const client = new Evernote.Client(token: token);
  // If we didn't have token we would have to fetch it now
  const TOKEN = process.env.EVERNOTE_TOKEN;
  const client = new Evernote.Client({
    token: TOKEN,
    sandbox: false,
    china: false
  });
  const noteStore = client.getNoteStore();

 /*****************************************************************************/

const EvernoteToDatabase = async evernoteId => {
  const note = await getEvernoteNote(noteStore, evernoteId);
  //  const updateOrCreateNote = () => {
  //  }
  console.log('NOTE =>', note);
}

// const evernoteId = 'c9fb2158-ebf1-480b-a3ff-7bad821bc10b';

export default EvernoteToDatabase;
