// api/count.js

const { clean } = require("./clean");

// PUT THESE IN OTHER FILES?
const { getWordsList } = require("most-common-words-by-language");
var commonestWords = getWordsList("english", 20000);

// lemma
const lemmatize = require("extract-lemmatized-nonstop-words");

exports.recency = (text) => {
  const cleanedContent = clean(text);

  let candidates = new Array();

  // REFACTOR make this a function with clean? flag
  const words = text
    .replace(/[^\p{L}']+/gu, " ")
    .trim()
    .split(" ")
    .filter((word) => word !== "");
  const cleanedWords = cleanedContent.split(" ").filter((word) => word !== "");

  // replace with map or forEach((element, index, array) => { /* … */ })
  for (let i = 0; i < cleanedWords.length; i++) {
    const item = cleanedWords[i].replace(/'[\p{L}]+/gu, "");
    // const lemma = stemmer.stem(item);
    const lemma = (lemmatize(item).length && lemmatize(item)[0].lemma) || item;

    // Only output uncommon words
    if (
      commonestWords.indexOf(item) > 7500 ||
      commonestWords.indexOf(item) === -1
    ) {
      candidates.push([i, lemma, item, commonestWords.indexOf(item)]);
    }
  }

  const sortedArray = candidates.sort((a, b) => a[1].localeCompare(b[1]));

  for (let i = 1; i < sortedArray.length; i++) {
    if (
      sortedArray[i][1] === sortedArray[i - 1][1] &&
      sortedArray[i][0] - sortedArray[i - 1][0] < 100
    ) {
      sortedArray[i].push(sortedArray[i][0] - sortedArray[i - 1][0]);
      sortedArray[i].push(
        cleanedWords
          .slice(sortedArray[i - 1][0] - 10, sortedArray[i][0] + 10)
          .join(" ")
          .replace(` ${sortedArray[i - 1][2]} `, ` *${sortedArray[i - 1][2]}* `)
          .replace(` ${sortedArray[i][2]} `, ` *${sortedArray[i][2]}* `)
      );
    }
  }

  return sortedArray.filter((i) => i[4]);
};
