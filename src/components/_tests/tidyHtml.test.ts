export = {};

const tidyHtml = require("../tidyHtml");

test("Trims leading space inside tags.", () => {
  expect(tidyHtml("<p> Trims leading space inside tags.</p>")).toBe(
    "<p>Trims leading space inside tags.</p>"
  );
});

test("Trims trailing space inside tags.", () => {
  expect(tidyHtml("<p>Trims trailing space inside tags. </p>")).toBe(
    "<p>Trims trailing space inside tags.</p>"
  );
});

test("Trims leading space inside tags with attributes.", () => {
  expect(
    tidyHtml('<p class="test"> Trims leading space inside tags.</p>')
  ).toBe('<p class="test">Trims leading space inside tags.</p>');
});

test("Does not trim spaces outside links.", () => {
  expect(
    tidyHtml(
      '<p>Does not trim spaces around <a href="http://example.com">links</a> at all.</p>'
    )
  ).toBe(
    '<p>Does not trim spaces around <a href="http://example.com">links</a> at all.</p>'
  );
});

test("Does not trim spaces outside spans.", () => {
  expect(
    tidyHtml("<p>Does not trim spaces around <span>spans</span> at all.</p>")
  ).toBe("<p>Does not trim spaces around <span>spans</span> at all.</p>");
});

test("Trim spaces inside links.", () => {
  expect(
    tidyHtml(
      '<p>Does not trim spaces around <a href="http://example.com"> links </a> at all.</p>'
    )
  ).toBe(
    '<p>Does not trim spaces around <a href="http://example.com">links</a> at all.</p>'
  );
});

test("Trims spaces inside spans.", () => {
  expect(
    tidyHtml("<p>Does not trim spaces around <span> spans </span> at all.</p>")
  ).toBe("<p>Does not trim spaces around <span>spans</span> at all.</p>");
});

test("Trims all superfluous space.", () => {
  expect(
    tidyHtml(
      '<p class="test">  Trims leading space <span>inside</span> tags.   </p>'
    )
  ).toBe('<p class="test">Trims leading space <span>inside</span> tags.</p>');
});
