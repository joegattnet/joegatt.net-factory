export {};

const sanitize = require("sanitize-html");

module.exports = (
  textString: string,
  allowedTags: Array<string> = [],
  allowedAttributes: any = {},
  allowedClasses: any = {}
) =>
  sanitize(textString.replace(/className/gim, "class"), {
    allowedTags,
    allowedAttributes,
    allowedClasses,
  })
    .replace(/class/gim, "className")
    .trim();
