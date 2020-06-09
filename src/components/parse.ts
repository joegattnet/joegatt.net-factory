export {};

const htmlparser2 = require("htmlparser2");
const clean = require("./clean");
const config = require("./../config");

module.exports = (unformattedText: string, hyphenate: boolean) => {
  let text = "";
  const parser = new htmlparser2.Parser(
    {
      onopentag(tagName: string, attributes: Attributes) {
        if (tagName === "a") {
          text = text.concat(`<a href="${attributes.href}">`);
        }
        if (config.ALLOWED_TAGS.includes(tagName)) {
          text = text.concat(`<${tagName}>`);
        }
        if (config.SPANNED_TAGS.includes(tagName)) {
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
        if (config.SPANNED_TAGS.includes(tagName)) {
          text = text.concat("</span>");
        }
        if (config.ALLOWED_TAGS.concat("a").includes(tagName)) {
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
