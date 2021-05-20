const stanza = require("../stanza");

test("Returns text as a stanza of syllablesPerLine syllables", () => {
  expect(
    stanza(
      "This should be truncated to ten words without dividing any words at all.",
      10
    )
  ).toBe(19);
});
