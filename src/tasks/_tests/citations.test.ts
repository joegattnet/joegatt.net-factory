export {};

const { formatCitation } = require("../citations");
const tidyHtml = require("../../components/tidyHtml");

const input = {
  id: 1,
  body:
    "This is a <strong>quote</strong>.\n-- “LRB · Malcolm Bull · Great Again: America’s Heidegger” at https://lrb.co.uk/patty",
};
const expectedBlurb = tidyHtml(`<figure class="citation">
  <blockquote>This is a quote.</blockquote>
  <figcaption>Malcolm Bull: “Great Again: America’s Heidegger” at lrb.co.uk</figcaption>
</figure>`);
const expectedBody = tidyHtml(`<figure class="citation">
  <blockquote>This is a <span className="strong">quote</span>.</blockquote>
  <figcaption>Malcolm Bull: “Great Again: America’s Heidegger” at <a href="https://lrb.co.uk/patty">lrb.co.uk</a></figcaption>
</figure>`);

const output = formatCitation(input);

test("It returns the id", () => {
  expect(output.id).toBe(1);
});

test("It returns the cached url (path)", () => {
  expect(output.path).toBe("/citations/1");
});

test("Parses blurb", () => {
  expect(output.blurb).toBe(expectedBlurb);
});

test("Parses body", () => {
  expect(output.body).toBe(expectedBody);
});
