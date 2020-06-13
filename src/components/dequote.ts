export {};

module.exports = (textString: string) => {
  const trims = [
    {
      // Remove everything after -30-
      findRegExp: new RegExp(/{quote:(.*?)}/, "gm"),
      replaceString: "$1",
    },
  ];
  return trims.reduce(
    (text, { findRegExp, replaceString }) =>
      text.replace(findRegExp, replaceString),
    textString
  );
};
