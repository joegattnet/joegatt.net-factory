const { recency } = require("./recency");

var textract = require("textract");

const filePath =
  "/home/joegatt/Documents/Work/Heart of a Heartless World/Heart of a Heartless World v10.odt";

textract.fromFileWithPath(filePath, (error, text) => {
  if (error) return console.log(error);
  const result = recency(text);
  result.forEach((item) =>
    console.log(
      `"${item[0]}","${item[1]}","${item[2]}","${item[3]}","${item[4]}","${item[5]}"`
    )
  );
});
