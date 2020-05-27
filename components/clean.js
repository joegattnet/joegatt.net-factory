const enGb = require('hyphenated-en-gb');
const { hyphenated } = require('hyphenated');
const smartquotes = require('smartquotes');

const clean = text => {
  // REVIEW: Remove when https://caniuse.com/#search=hyphens is green
  // text = text.concat(text);
  // choose language
  return hyphenated(
           smartquotes(
             text.replace(/ -- | - /gm, '—')
               .replace(/&nbsp;|  /gm, ' ')
            ),
            { 
              language: enGb,
              ocd: true
            }
          );
};

module.exports.clean = clean;
