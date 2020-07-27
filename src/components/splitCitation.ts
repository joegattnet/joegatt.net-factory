export {};

module.exports = (textString: string) => {
  const split = textString.match(/^(.*)\n*?\s*(--|—)\s*(.*?)$/m);
  if (!split) {
    return { citationText: textString, attribution: "Anon" };
  }
  return {
    citationText: split[1],
    attribution: split[3],
  };
};
