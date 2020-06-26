const dequote = require("../dequote");

test("Removes quote curly braces indicator", () => {
  expect(
    dequote(" {quote: This and that\n-- Bob at https://www.example.com } ")
  ).toBe("This and that\n-- Bob at https://www.example.com");
});
