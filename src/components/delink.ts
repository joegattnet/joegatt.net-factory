export {};

module.exports = (textString: string) => {
  const trims = [
    {
      // Remove link and leave as domain
      findRegExp: new RegExp(
        /([^"])(https?:\/\/)(www\.)?([^\/]+)+(\/.*)?\b/,
        "gm"
      ),
      replaceString: "$1$4",
    },
    {
      // Remove lone urls and leave as domain
      findRegExp: new RegExp(
        /^\s*(https?:\/\/)(www\.)?([^\/]+)+(\/.*)?\b/,
        "gm"
      ),
      replaceString: "$3",
    },
    {
      // Remove trailing slash
      findRegExp: new RegExp(/\/$/, "gm"),
      replaceString: "",
    },
  ];
  return trims.reduce(
    (text, { findRegExp, replaceString }) =>
      text.replace(findRegExp, replaceString),
    textString
  );
};
