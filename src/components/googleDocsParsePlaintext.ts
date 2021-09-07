/**
 * Parse GoogleDocs body and format into our simplified format.
 * @param {object} data The body object.
 */

export {};

module.exports = (data: any): string => {
  console.log(data);
  const textArray = data.body.content.map((chunk: ContentChunk) => {
    if (!chunk.paragraph) return null;
    switch (chunk.paragraph.paragraphStyle.namedStyleType) {
      case 'NORMAL_TEXT': {
        return chunk.paragraph.elements.map(element => {
          if (element.textRun) return element.textRun.content.trim();
          return null;
        }).join(' ');
      }
      default:
        const headingText = chunk.paragraph.elements[0].textRun && chunk.paragraph.elements[0].textRun.content.trim();
        console.log('>>> ', headingText, headingText === '--30--');
        if (headingText === '--30--' || headingText === '-30-') return headingText;
        return null;
    }
  });
  const plainText = textArray.flat().filter(Boolean).map((line: string) => line && line.replace(/\n+/gm, '\n').replace(/ +/gm, ' ')).join('\n').split('--30--')[0].trim();
  return plainText;
};
