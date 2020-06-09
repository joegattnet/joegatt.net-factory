const parse = require("./parse");

// test("Divs become paragraphs..", () => {
//   expect(parse("<div>Divs become paragraphs.</div>")).toBe(
//     "<p>Divs become paragraphs.</p>"
//   );
// });

test("Text passes through.", () => {
  expect(parse("Text passes through.", false)).toBe("Text passes through.");
});

test("Links pass through.", () => {
  expect(
    parse('Links <a href="http://example.com">pass</a> through.', false)
  ).toBe('Links <a href="http://example.com">pass</a> through.');
});

test("Ordered lists pass through.", () => {
  expect(parse("<ol><li>First item</li><li>Second item</li></ol>", false)).toBe(
    "<ol><li>First item</li><li>Second item</li></ol>"
  );
});

test("Unordered lists pass through.", () => {
  expect(parse("<ul><li>First item</li><li>Second item</li></ul>", false)).toBe(
    "<ul><li>First item</li><li>Second item</li></ul>"
  );
});

test("Tables pass through.", () => {
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
  expect(parse("This becomes<br />a new line.", { hyphenate: false })).toBe(
    "This becomes\na new line."
  );
});

test("Empty text fragments become one space.", () => {
  expect(parse("<li>   </li>", { hyphenate: false })).toBe("<li> </li>");
});

test("<em> becomes span with class.", () => {
  expect(parse("<em>Divs become paragraphs.</em>", { hyphenate: false })).toBe(
    '<span className="em">Divs become paragraphs.</span>'
  );
});

test("<strong> becomes span with class.", () => {
  expect(
    parse("<strong>Divs become paragraphs.</strong>", { hyphenate: false })
  ).toBe('<span className="strong">Divs become paragraphs.</span>');
});

test("The text is passed on for cleaning", () => {
  expect(
    parse("The text is passed on -- for cleaning.", { hyphenate: false })
  ).toBe("The text is passed on—for cleaning.");
});

test("Clean option false does not hyphenate the text.", () => {
  expect(parse("Clean option false does not hyphenate the text.")).toBe(
    "Clean option false does not hyphenate the text."
  );
});
