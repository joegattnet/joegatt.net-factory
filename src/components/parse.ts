export {};

const htmlparser2 = require("htmlparser2");
const clean = require("./clean");
const config = require("./../config");

// REVIEW: This can't be the best way to do the defaults!
module.exports = (
  unformattedText: string,
  {
    allowedTags = config.ALLOWED_TAGS_BODY,
    hyphenate = false,
    spannedTags = config.SPANNED_TAGS,
  }: ParseOptions = {
    allowedTags: config.ALLOWED_TAGS_BODY,
    hyphenate: false,
    spannedTags: config.SPANNED_TAGS,
  }
) => {
  let text = "";
  const parser = new htmlparser2.Parser(
    {
      onopentag(tagName: string, attributes: Attributes) {
        if (allowedTags.includes(tagName)) {
          text = text.concat(
            tagName === "a" ? `<a href="${attributes.href}">` : `<${tagName}>`
          );
        }
        if (spannedTags.includes(tagName)) {
          text = text.concat(`<span className="${tagName}">`);
        }
        if (tagName === "br") {
          text = text.concat("\n");
        }
      },
      ontext(textFragment: string) {
        if (textFragment.trim() === "") {
          return (text = text.concat(" "));
        }
        text = text.concat(clean(textFragment, hyphenate));
      },
      onclosetag(tagName: string) {
        if (spannedTags.includes(tagName)) {
          text = text.concat("</span>");
        }
        if (allowedTags.includes(tagName)) {
          text = text.concat(`</${tagName}>`);
        }
      },
    },
    { decodeEntities: true }
  );
  parser.write(unformattedText);
  parser.end();

  return text;
};
