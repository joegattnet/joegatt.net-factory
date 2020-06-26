export {};

module.exports = (textString: string) => {
  const trims = [
    {
      // Remove {quote: scaffold}
      findRegExp: new RegExp(/^\s*\{quote:\s*(.*?)\s*\}\s*$/, "gims"),
      replaceString: "$1",
    },
  ];
  return trims.reduce(
    (text, { findRegExp, replaceString }) =>
      text.replace(findRegExp, replaceString),
    textString
  );
};
