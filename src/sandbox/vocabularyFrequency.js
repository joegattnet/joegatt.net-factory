const { clean } = require("./clean");
const { frequency } = require("./frequency");

var textract = require("textract");

const filePath = "Heart of a Heartless World v8-0.odt";

textract.fromFileWithPath(filePath, (error, text) => {
  if (error) return console.log(error);
  const result = frequency(cleanedContent);
  result.forEach((item) =>
    console.log(
      `"${item.word}","${item.count}","${item.common}","${item.examples
        .sort((a, b) => a.length - b.length)
        .join(", ")}"`
    )
  );
});
