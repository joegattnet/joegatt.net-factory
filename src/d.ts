interface Attributes {
  href: string;
}

interface EvernoteNote {
  guid: string,
  title: string,
  content: string,
  contentHash: string,
  contentLength: number,
  created: number,
  updated: number,
  deleted: null,
  active: Boolean,
  updateSequenceNum: number,
  notebookGuid: string,
  tagGuids: Array<string>,
  resources: null,
  attributes: {
    subjectDate: null,
    latitude: null,
    longitude: null,
    altitude: null,
    author: 'Joe Gatt',
    source: null,
    sourceURL: 'file:///',
    sourceApplication: null,
    shareDate: null,
    reminderOrder: null,
    reminderDoneTime: null,
    reminderTime: null,
    placeName: null,
    contentClass: null,
    applicationData: null,
    lastEditedBy: null,
    classifications: null,
    creatorId: null,
    lastEditorId: null,
    sharedWithBusiness: null,
    conflictSourceNoteGuid: null,
    noteTitleQuality: 0
  },
  tagNames: null,
  sharedNotes: null,
  restrictions: null,
  limits: null
}

interface EvernoteNotebook {
  guid: string
}

interface EvernoteNoteStore {
  createNote: Function,
  updateNote: Function
}

interface GoogleCredentials {
  installed:{
    client_id: string,
    project_id: string,
    auth_uri: string,
    token_uri:string,
    auth_provider_x509_cert_url: string,
    client_secret: string,
    redirect_uris: Array<string>
  }
}

interface Note {
  author?: string;
  body: string;
  cached_source_html?: string;
  cached_url?: string;
  id: number;
  source_url?: string;
  title: string;
  urlAuthor?: string;
}

interface ParseOptions {
  allowedTags?: Array<string>;
  hyphenate?: boolean;
  spannedTags?: Array<string>;
}

interface UpdateCitationValues {
  blurb: string;
  body: string;
  id: number;
  path: string;
}
