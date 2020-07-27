const splitCitation = require("../splitCitation");

test("Split citation", () => {
  expect(splitCitation("The quotation--the attribution")).toMatchObject({
    citationText: "The quotation",
    attribution: "the attribution",
  });
});

test("Splits correctly even when there are two dashes", () => {
  expect(
    splitCitation("The quotation is longer--than expected--the attribution")
  ).toMatchObject({
    citationText: "The quotation is longer--than expected",
    attribution: "the attribution",
  });
});

test("Splits correctly even when the text is complex", () => {
  expect(
    splitCitation(
      'This is a <strong>quote</strong>.\n-- “LRB · Malcolm Bull · Great Again: America’s Heidegger” at <a href="https://lrb.co.uk/patty">https://lrb.co.uk/patty</a>'
    )
  ).toMatchObject({
    citationText: "This is a <strong>quote</strong>.",
    attribution:
      '“LRB · Malcolm Bull · Great Again: America’s Heidegger” at <a href="https://lrb.co.uk/patty">https://lrb.co.uk/patty</a>',
  });
});

test("Splits correctly even when the citation text is shorter than the attribution", () => {
  expect(
    splitCitation("The quotation--is shorter than the unexpected attribution")
  ).toMatchObject({
    citationText: "The quotation",
    attribution: "is shorter than the unexpected attribution",
  });
});

test("Split citation", () => {
  expect(splitCitation("The quotation—the attribution")).toMatchObject({
    citationText: "The quotation",
    attribution: "the attribution",
  });
});

test("Splits correctly even when there are two dashes", () => {
  expect(
    splitCitation("The quotation is longer—than expected—the attribution")
  ).toMatchObject({
    citationText: "The quotation is longer—than expected",
    attribution: "the attribution",
  });
});

test("Splits correctly even when the citation text is shorter than the attribution", () => {
  expect(
    splitCitation("The quotation—is shorter than the unexpected attribution")
  ).toMatchObject({
    citationText: "The quotation",
    attribution: "is shorter than the unexpected attribution",
  });
});

test("Splits correctly even when there are mixed dashes", () => {
  expect(
    splitCitation("The quotation is longer—than expected--the attribution")
  ).toMatchObject({
    citationText: "The quotation is longer—than expected",
    attribution: "the attribution",
  });
});

test("Splits correctly even when there are line breaks", () => {
  expect(
    splitCitation("The quotation is longer—than expected\n\n--the attribution")
  ).toMatchObject({
    citationText: "The quotation is longer—than expected",
    attribution: "the attribution",
  });
});

test("Returns an empty string if no attribution is found", () => {
  expect(splitCitation("The quotation is longer than expected")).toMatchObject({
    citationText: "The quotation is longer than expected",
    attribution: "Anon",
  });
});
