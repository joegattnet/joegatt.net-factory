export {};

const truncate = require("../truncate");

test("Truncates text", () => {
  expect(
    truncate(
      "This should be truncated to ten words without dividing any words at all.",
      10
    )
  ).toBe("This should be truncated to ten words without dividing any...");
});

test("Truncates text correctly inside html", () => {
  expect(
    truncate(
      "<p>This should be truncated to ten words without dividing any words at all.</p>",
      10
    )
  ).toBe(
    "<p>This should be truncated to ten words without dividing any...</p>"
  );
});

test("Truncates text to provided number of words", () => {
  expect(
    truncate(
      "This should be truncated to six words without dividing any words at all.",
      6
    )
  ).toBe("This should be truncated to six...");
});
