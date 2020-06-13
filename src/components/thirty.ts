export {};

module.exports = (textString: string) => {
  const trims = [
    {
      // Remove everything after -30-
      findRegExp: new RegExp(/\n\-\-?30\-\-?\n.*/, "gm"),
      replaceString: "",
    },
  ];
  return trims.reduce(
    (text, { findRegExp, replaceString }) =>
      text.replace(findRegExp, replaceString),
    textString
  );
};
