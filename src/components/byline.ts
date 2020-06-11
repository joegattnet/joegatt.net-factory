export {};

module.exports = (textString: string) => {
  const trims = [
    {
      // Remove trailing slash
      findRegExp: new RegExp(/\/$/, "gm"),
      replaceString: "",
    },
    {
      findRegExp: new RegExp(/( \| .*?)("|”)(.*)/, "gm"),
      replaceString: "$2$3",
    },
    {
      // LRB 1
      findRegExp: new RegExp(
        /("|“)LRB · (.*?) · (.*?)("|”).*( at lrb\.co\.uk).*/,
        "gm"
      ),
      replaceString: "$2: $1$3$4$5",
    },
    {
      // LRB 2
      findRegExp: new RegExp(
        /("|“)(.*?) · (.*?) · LRB.*?("|”).*( at lrb\.co\.uk).*/,
        "gm"
      ),
      replaceString: "$2: $1$3$4$5",
    },
  ];
  return trims.reduce(
    (text, { findRegExp, replaceString }) =>
      text.replace(findRegExp, replaceString),
    textString
  );
};
