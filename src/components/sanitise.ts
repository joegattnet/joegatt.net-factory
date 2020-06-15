export {};

const sanitize = require("sanitize-html");

module.exports = (
  textString: string,
  allowedTags: Array<string> = [],
  allowedAttributes: any = {},
  allowedClasses: any = {}
) =>
  sanitize(textString, {
    allowedTags,
    allowedAttributes,
    allowedClasses,
  }).trim();
