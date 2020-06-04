interface Note {
  id: number;
  body: string;
  cached_source_html?: string;
  cached_url?: string;
  source_url?: string;
  title: string;
}

interface Attributes {
  href: string;
}
