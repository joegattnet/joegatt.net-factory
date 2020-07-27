const byline = require("../byline");

test("Remove trailing slash", () => {
  expect(byline("Article by John Smith at salon.com/")).toBe(
    "Article by John Smith at salon.com"
  );
});

test("Author attribution at lrb.co.uk", () => {
  expect(
    byline(
      "“LRB · Malcolm Bull · Great Again: America’s Heidegger” at https://lrb.co.uk/patty"
    )
  ).toBe(
    "Malcolm Bull: “Great Again: America’s Heidegger” at https://lrb.co.uk/patty"
  );
});

test("Author attribution at lrb.co.uk (new style)", () => {
  expect(
    byline(
      "“Malcolm Bull · Great Again: America’s Heidegger · LRB 08.06.2020” at https://lrb.co.uk/patsy"
    )
  ).toBe(
    "Malcolm Bull: “Great Again: America’s Heidegger” at https://lrb.co.uk/patsy"
  );
});

test("Author attribution at lrb.co.uk using &middot;", () => {
  expect(
    byline(
      "“LRB &middot; Malcolm Bull &middot; Great Again: America’s Heidegger” at https://lrb.co.uk/patty"
    )
  ).toBe(
    "Malcolm Bull: “Great Again: America’s Heidegger” at https://lrb.co.uk/patty"
  );
});

test("Author attribution at lrb.co.uk (new style) using &middot;", () => {
  expect(
    byline(
      "“Malcolm Bull &middot; Great Again: America’s Heidegger &middot; LRB 08.06.2020” at https://lrb.co.uk/patsy"
    )
  ).toBe(
    "Malcolm Bull: “Great Again: America’s Heidegger” at https://lrb.co.uk/patsy"
  );
});

test("Author attribution at lrb.co.uk", () => {
  expect(
    byline(
      '"LRB · Malcolm Bull · Great Again: America’s Heidegger" at https://lrb.co.uk/patty'
    )
  ).toBe(
    'Malcolm Bull: "Great Again: America’s Heidegger" at https://lrb.co.uk/patty'
  );
});

test("Author attribution at lrb.co.uk (new style)", () => {
  expect(
    byline(
      '"Malcolm Bull · Great Again: America’s Heidegger · LRB 08.06.2020" at https://lrb.co.uk/patsy'
    )
  ).toBe(
    'Malcolm Bull: "Great Again: America’s Heidegger" at https://lrb.co.uk/patsy'
  );
});
