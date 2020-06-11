interface Attributes {
  href: string;
}

interface Note {
  id: number;
  author?: string;
  body: string;
  cached_source_html?: string;
  cached_url?: string;
  source_url?: string;
  title: string;
  urlAuthor?: string;
}

interface updateCitationValues {
  id: number;
  path: string;
  blurb: string;
  body: string;
}
