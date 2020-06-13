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
      // LRB 1: “LRB · Malcolm Bull · Great Again: Heidegger” at http://www.lrb.co.uk/etc
      findRegExp: new RegExp(
        /("|“)LRB · (.*?) · (.*?)("|”).*( at )(https?:\/\/lrb\.co\.uk[a-z\/]*)/,
        "gm"
      ),
      replaceString: "$2: $1$3$4$5$6",
    },
    {
      // LRB 2:
      findRegExp: new RegExp(
        /("|“)(.*?) · (.*?) · LRB.*?("|”).*( at )(https?:\/\/lrb\.co\.uk[a-z\/]*)/,
        "gm"
      ),
      replaceString: "$2: $1$3$4$5$6",
    },
  ];
  return trims.reduce(
    (text, { findRegExp, replaceString }) =>
      text.replace(findRegExp, replaceString),
    textString
  );
};
