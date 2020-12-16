/**
 * Format an individual footnote for GoogleDocs.
 * @param {Footnote} footnote The structured footnote object
 */

export {};

module.exports = (footnote: Footnote): string => {
  // REVIEW: Can we refactor this?
  const textArray = footnote.content.map(chunk => {
    if (!chunk.paragraph) return null;
    return chunk.paragraph.elements.map(element => {
      if (element.textRun && element.textRun.textStyle.link) {
        return `<a href="${element.textRun.textStyle.link.url}">${element.textRun.content.trim()}</a>`;
      }
      if (element.textRun) return element.textRun.content.trim();
      return null;
    }).join(' ');
  });
  const textString = textArray.join('');
  textString.replace(/ +/gm, ' ');
  return `[${textString}]`;
};
