const parse = require("../parse");

// test("Divs become paragraphs..", () => {
//   expect(parse("<div>Divs become paragraphs.</div>")).toBe(
//     "<p>Divs become paragraphs.</p>"
//   );
// });

test("Text passes through by default.", () => {
  expect(parse("Text passes through.")).toBe("Text passes through.");
});

test("Links pass through by default.", () => {
  expect(parse('Links <a href="http://example.com">pass</a> through.')).toBe(
    'Links <a href="http://example.com">pass</a> through.'
  );
});

test("Ordered lists pass through by default.", () => {
  expect(parse("<ol><li>First item</li><li>Second item</li></ol>")).toBe(
    "<ol><li>First item</li><li>Second item</li></ol>"
  );
});

test("Unordered lists pass through by default.", () => {
  expect(parse("<ul><li>First item</li><li>Second item</li></ul>")).toBe(
    "<ul><li>First item</li><li>Second item</li></ul>"
  );
});

test("Tables pass through by default.", () => {
  expect(
    parse(
      "<table><tr><td>First</td><td>Second</td></tr><tr><td>Third</td><td>Fourth</td></tr></table>",
      false
    )
  ).toBe(
    "<table><tr><td>First</td><td>Second</td></tr><tr><td>Third</td><td>Fourth</td></tr></table>"
  );
});

test("<br> becomes new line.", () => {
  expect(parse("This becomes<br />a new line.")).toBe(
    "This becomes\na new line."
  );
});

test("Empty text fragments become one space.", () => {
  expect(parse("<li>   </li>")).toBe("<li> </li>");
});

test("<em> becomes span with class.", () => {
  expect(parse("<em>Divs become paragraphs.</em>")).toBe(
    '<span className="em">Divs become paragraphs.</span>'
  );
});

test("<strong> becomes span with class.", () => {
  expect(parse("<strong>Divs become paragraphs.</strong>")).toBe(
    '<span className="strong">Divs become paragraphs.</span>'
  );
});

test("The text is passed on for cleaning", () => {
  expect(parse("The text is passed on -- for cleaning.")).toBe(
    "The text is passed on—for cleaning."
  );
});

test("Clean option false does not hyphenate the text.", () => {
  expect(parse("Clean option false does not hyphenate the text.")).toBe(
    "Clean option false does not hyphenate the text."
  );
});

test("Keeps tags and attributes if instructed to", () => {
  expect(
    parse("<p>Some\n <random>strong</random> content.</p>", {
      allowedTags: ["random"],
    })
  ).toBe("Some\n <random>strong</random> content.");
});
