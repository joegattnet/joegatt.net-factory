export {};

module.exports = (textString: string) => {
  const split = textString.match(/^(.*)\n*?(--|—)(.*?)$/m);
  if (!split) {
    return { citationText: textString, attribution: "Anon" };
  }
  return {
    citationText: split[1],
    attribution: split[3],
  };
};
