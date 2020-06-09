export {};

const flow = require("lodash/fp/flow");
const hyphenate = require("./hyphenate");
const smartquotes = require("smartquotes");

const smartHyphens = (textString: string) => {
  const trims = [
    {
      // Smart em-dashes
      findRegExp: new RegExp(/ *-- */, "gm"),
      replaceString: "—",
    },
    {
      // Smart en-dashes
      findRegExp: new RegExp(/ +- +/, "gm"),
      replaceString: "–",
    },
    {
      // Remove non- breaking spaces
      findRegExp: new RegExp(/&nbsp;/, "gm"),
      replaceString: " ",
    },
  ];
  return trims.reduce(
    (text, { findRegExp, replaceString }) =>
      text.replace(findRegExp, replaceString),
    textString
  );
};

module.exports = (textString: string, options: { [key: string]: boolean }) => {
  const processes = [
    smartquotes,
    smartHyphens,
    hyphenate && ((options && options.hyphenate) || true),
  ].filter((item) => typeof item === "function");
  return flow(processes)(textString);
};
