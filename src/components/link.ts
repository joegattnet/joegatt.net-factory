export {};

module.exports = (textString: string) => {
  const trims = [
    {
      // Replace link text with domain
      findRegExp: new RegExp(/(https?:\/\/)(www\.)?([^\/]+)+(\/.*)?\b/, "gm"),
      replaceString: '<a href="$1$2$3$4">$3</a>',
    },
  ];
  return trims.reduce(
    (text, { findRegExp, replaceString }) =>
      text.replace(findRegExp, replaceString),
    textString
  );
};
