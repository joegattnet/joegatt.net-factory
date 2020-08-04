interface Attributes {
  href: string;
}

interface EvernoteNote {
  active:	boolean;
  attributes: {
    subjectDate: number;
    altitude: BigInt;
    // applicationData: Array<string, string>;
    author:	string;
    // classifications: Array<string, string>;
    conflictSourceNoteGuid:	BigInt;
    contentClass:	string;
    creatorId: BigInt;
    lastEditedBy:	string;
    lastEditorId:	BigInt;
    latitude: number;
    longitude: number;
    noteTitleQuality: BigInt
    placeName:	string;
    reminderDoneTime: number;
    reminderOrder: BigInt
    reminderTime: number;
    shareDate: number;
    sharedWithBusiness: boolean;
    source: string;
    sourceApplication: string;
    sourceURL: string;
  };
  content: string;
  contentHash: string;
  contentLength: number;
  created: number;
  deleted: number;
  guid: string;
  // limits:	NoteLimits;
  notebookGuid:	string;
  // resources: Array<Resource>;
  // restrictions:	NoteRestrictions;
  // sharedNotes: Array<SharedNote>;
  tagGuids:	Array<string>;
  tagNames:	Array<string>;
  title: string;
  updateSequenceNum: number;
  updated: number;
}

interface EvernoteNotebook {
  guid: string
}

interface EvernoteNoteStore {
  createNote: Function;
  updateNote: Function
}

interface GoogleCredentials {
  installed: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri:string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
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
