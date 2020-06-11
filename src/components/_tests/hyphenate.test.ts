const hyphenate = require("../hyphenate");

test("Trims multiple spaces", () => {
  expect(hyphenate("xxx")).toBe("xxx");
});
