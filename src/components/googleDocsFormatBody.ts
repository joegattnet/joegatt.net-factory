/**
 * Format the note body for GoogleDocs.
 * @param {object} data The body object.
 */

const googleDocsFormatFootnote = require('./googleDocsFormatFootnote');

export {};

module.exports = (data: any): string => {
  const textArray = data.body.content.map((chunk: ContentChunk) => {
    if (!chunk.paragraph) return null;
    switch (chunk.paragraph.paragraphStyle.namedStyleType) {
      case 'TITLE':
        return null;
      case 'HEADING_4': {
        const headingText = chunk.paragraph.elements[0].textRun.content.trim();
        return ['',`<strong>${headingText}</strong>`.replace(/\{\{\{\{/, '{{').replace(/\}\}\}\}/, '}}')];
      }
      case 'HEADING_5': {
        const headingText = chunk.paragraph.elements[0].textRun && chunk.paragraph.elements[0].textRun.content.trim();
        if (headingText === '--30--' || headingText === '-30-') return headingText;
        return [' ',`{\{${headingText}\}\}`];
      }
      default: {
        return chunk.paragraph.elements.map(element => {
          if (element.textRun && element.textRun.textStyle.link) {
            return `<a href="${element.textRun.textStyle.link.url}">${element.textRun.content.trim()}</a>`;
          }
          if (element.textRun) return element.textRun.content.trim();
          if (element.footnoteReference) return googleDocsFormatFootnote(data.footnotes[element.footnoteReference.footnoteId]);
          return null;
        }).join(' ');
      }
    }
  });
  const textString = textArray.flat().filter(Boolean).map((line: string) => line && `<p>${line.replace(/\&/gm, '&amp;').replace(/\n\n\n+/gm, '\n\n').replace(/ +/gm, ' ')}</p>\n`).join('\n').trim();
  // textString.replace(/\n\n\n+/gm, '\n\n').replace(/ +/gm, ' ');
  // return textString.replace(/\n\n\n\n\{\{/gm, '\n\n\n{{').replace(/\}\}\n\n/gm, '}}\n').split('\n');
  return textString;
};

// const googleDocsFormatBody = (data: GaxiosResponse<docs_v1.Schema$Document>): string => {
