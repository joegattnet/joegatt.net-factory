export {};

const { formatCitation } = require("../citation");
const tidyHtml = require("../components/tidyHtml");

const input = {
  id: 1,
  body: "This is a <strong>quote</strong>.\n-- Bob at example.com",
};
const expectedBlurb = tidyHtml(`<figure class="citation">
  <blockquote>This is a quote.</blockquote>
  <figcaption>Bob at example.com</figcaption>
</figure>`);
const expectedBody = tidyHtml(`<figure class="citation">
  <blockquote>This is a <span className="strong">quote</span>.</blockquote>
  <figcaption>Bob at example.com</figcaption>
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
