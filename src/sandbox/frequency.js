// api/count.js

// PUT THESE IN OTHER FILES?
const { getWordsList } = require("most-common-words-by-language");
var commonestWords = getWordsList("english", 20000);

// lemma
const lemmatize = require("extract-lemmatized-nonstop-words");

exports.frequency = (string) => {
  let map = new Map();
  const words = string.split(" ").filter((word) => word !== "");

  for (let i = 0; i < words.length; i++) {
    const item = words[i].replace(/'[\p{L}]+/gu, "");
    // const lemma = stemmer.stem(item);
    const lemma = (lemmatize(item).length && lemmatize(item)[0].lemma) || item;
    let frequency = (map.get(lemma) && map.get(lemma).count + 1) || 1;
    let examplesArray = (map.get(lemma) && map.get(lemma).examples) || [];
    let examples = examplesArray.includes(item)
      ? examplesArray
      : [...examplesArray, item];
    map.set(lemma, {
      word: lemma,
      frequency,
      examples,
      common: commonestWords.indexOf(item),
    });
  }

  // for phrase counter create array of phrases but exclude any strings that contain words of frequency = 1

  const filteredMap = [...map.values()].sort((a, b) => b.count - a.count);
  // .filter((word) => word.count > 1)
  // const filteredMap = [...map.values()].sort((a, b) => a.word.localeCompare(b.word));

  return filteredMap;
};
