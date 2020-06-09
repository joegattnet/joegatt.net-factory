const { hyphenated } = require("hyphenated");
const dictionaries: { [key: string]: any } = {
  english: require("hyphenated-en-gb"),
  french: require("hyphenated-fr"),
  german: require("hyphenated-de"),
} as const;
const languageDetect = require("languagedetect");

// REVIEW hyphenated-it and hyphenated-mt are missing

module.exports = (text: string) => {
  const language = new languageDetect().detect(text)[0];
  return hyphenated(text, { language: dictionaries[language || "english"] });
};
