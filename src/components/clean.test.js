const clean = require("./clean");

test("Changes -- to m-dash", () => {
  expect(clean("<p>This--is an m-dash.</p>")).toBe("<p>This—is an m-dash.</p>");
});

test("Changes multipe -- to m-dashes", () => {
  expect(clean("<p>This--and--is an m-dash.</p>")).toBe(
    "<p>This—and—is an m-dash.</p>"
  );
});

test("Reduces multiple spaces to one", () => {
  expect(clean("<p>This   space is now one.</p>")).toBe(
    "<p>This space is now one.</p>"
  );
});

test("Change non-breaking spaces to normal spaces", () => {
  expect(clean("<p>This&nbsp;space is now one.</p>")).toBe(
    "<p>This space is now one.</p>"
  );
});
