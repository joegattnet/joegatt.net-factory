export {};

const sanitise = require("../sanitise");

test("Removes inline tags", () => {
  expect(sanitise("Some <strong>strong</strong> content.")).toBe(
    "Some strong content."
  );
});

test("Removes inline tags and attributes", () => {
  expect(sanitise('Some <span class="strong">strong</span> content.')).toBe(
    "Some strong content."
  );
});

test("Removes nested tags and attributes", () => {
  expect(
    sanitise('<p>Some <span class="strong">strong</span> content.</p>')
  ).toBe("Some strong content.");
});

test("Removes nested tags and attributes when new lines are present", () => {
  expect(
    sanitise('<p>Some\n <span class="strong">strong</span> content.</p>')
  ).toBe("Some\n strong content.");
});

test("Keeps tags and attributes if instructed to", () => {
  expect(
    sanitise(
      '<p>Some\n <span class="strong">strong</span> content.</p>',
      ["span"],
      { span: ["class"] },
      { span: ["em", "strong"] }
    )
  ).toBe('Some\n <span className="strong">strong</span> content.');
});
