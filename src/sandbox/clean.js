// api/clean.js

exports.clean = (string) => {
  const alphabet = string
    .replace(/[^\p{L}']+/gu, " ")
    .trim()
    .toLowerCase();
  return alphabet;
};
