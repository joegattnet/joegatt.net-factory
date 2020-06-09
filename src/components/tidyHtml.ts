module.exports = (textString: string) => {
  const trims = [
    {
      // Remove multiple spaces
      findRegExp: new RegExp(/  */, "gm"),
      replaceString: " ",
    },
    {
      // Leading spaces inside tags
      findRegExp: new RegExp(/(<\w.*?>)\s*([\w])/, "gm"),
      replaceString: "$1$2",
    },
    {
      // Trailing spaces inside tags
      findRegExp: new RegExp(/\s*<\//, "gm"),
      replaceString: "</",
    },
  ];

  return trims.reduce(
    (text, { findRegExp, replaceString }) =>
      text.replace(findRegExp, replaceString),
    textString
  );
};
