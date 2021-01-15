interface Attributes {
  href: string;
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

interface ContentChunk {
  paragraph: {
    elements: [
      {
        textRun: {
          content: string
          textStyle: {
            link: {
              url: string
            }
          }
        },
        footnoteReference: {
          footnoteId: number
        }
      }
    ],
    paragraphStyle: {
      namedStyleType: 'TITLE' | 'HEADING_4' | 'HEADING_5'
    }
  }
}

// interface DocumentData {
//   body: {
//     content: [
//       ContentChunk
//     ]
//   },
//   footnotes: [
//     Footnote
//   ]
// }

interface Footnote {
  content: [
    ContentChunk
  ]
}

interface ParsedGoogleDoc {
  bodyText: string,
  evernoteId: string,
  googleDocsCollatedId?: string,
  googleDocsUnannotatedId?: string,
  title?: string
}

interface GoogleDocsParams {
  googleDocsId: string,
  collate?: boolean,
  unannotate?: boolean
}
