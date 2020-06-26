interface Attributes {
  href: string;
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
