export {};

const parse = require("./parse");

module.exports = (textString: string) => {
  return parse(textString, { allowedTags: [], spannedTags: [] });
};
