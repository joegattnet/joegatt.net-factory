const { clean } = require("./clean");

test("Changes -- to m-dash", () => {
  expect(clean("<p>This--is an m-dash.</p>")).toBe("<p>This—is an m-dash.</p>");
});

test("Changes multipe -- to m-dashes", () => {
  expect(clean("<p>This--and--is an m-dash.</p>")).toBe(
    "<p>This—and—is an m-dash.</p>"
  );
});
