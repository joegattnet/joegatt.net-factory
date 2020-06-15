import { clearConfigCache } from "prettier";

export {};

const config = require("./../config");
const truncate = require("truncate-html");

module.exports = (
  textString: string,
  length: number = config.BLURB_LENGTH,
  ellipsis: string = "..."
) => {
  return truncate(textString, length, { ellipsis, byWords: true });
};
