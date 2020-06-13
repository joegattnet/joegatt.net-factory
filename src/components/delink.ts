export {};

module.exports = (textString: string) => {
  const trims = [
    {
      // Remove link and leave as domain
      findRegExp: new RegExp(/(https?:\/\/)(www\.)?([^\/]+)+(\/.*)?\b/, "gm"),
      replaceString: "$3",
    },
  ];
  return trims.reduce(
    (text, { findRegExp, replaceString }) =>
      text.replace(findRegExp, replaceString),
    textString
  );
};
