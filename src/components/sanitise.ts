export {};

const sanitize = require("sanitize-html");

module.exports = (textString: string) => {
  return sanitize(textString, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
};
