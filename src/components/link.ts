export {};

module.exports = (textString: string) => {
  const trims = [
    {
      // Replace link text with domain
      //  Ignores link inside html tag
      findRegExp: new RegExp(
        /([^"])(https?:\/\/)(www\.)?([^\/]+)+(.*)?\b/,
        "gim"
      ),
      replaceString: '$1<a href="$2$3$4$5">$4</a>',
    },
  ];
  return trims.reduce(
    (text, { findRegExp, replaceString }) =>
      text.replace(findRegExp, replaceString),
    textString
  );
};
