import { syllable } from "syllable";

module.exports = (
  textString: string,
  syllablesPerLine: number = 10
) => {

  return syllable(textString);
};
