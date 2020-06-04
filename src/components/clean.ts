const enGb = require("hyphenated-en-gb");
const { hyphenated } = require("hyphenated");
const smartquotes = require("smartquotes");

module.exports = (text: string) => {
  // REVIEW: Remove this feature when https://caniuse.com/#search=hyphens is green
  // choose language
  return hyphenated(
    smartquotes(
      text.replace(/ *-- *| +- +/gm, "—").replace(/&nbsp;|  +/gm, " ")
    ),
    {
      language: enGb,
      ocd: true,
    }
  );
};
