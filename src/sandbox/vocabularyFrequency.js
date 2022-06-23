const { clean } = require("./clean");
const { count } = require("./count");

var textract = require("textract");

const filePath = "Heart of a Heartless World v7-03.odt";

textract.fromFileWithPath(filePath, (error, text) => {
  if (error) return console.log(error);
  const cleanedContent = clean(text);
  const result = count(cleanedContent);
  result.forEach((item) =>
    console.log(
      `"${item.word}","${item.count}","${item.common}","${item.examples
        .sort((a, b) => a.length - b.length)
        .join(", ")}"`
    )
  );
});
