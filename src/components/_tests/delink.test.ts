const delink = require("../delink");

test("Changes full urls to domains", () => {
  expect(delink("at https://www.example.com")).toBe("at example.com");
});

test("Changes very long urls to domains", () => {
  expect(
    delink(
      "at http://www.slate.com/articles/health_and_science/medical_examiner/2016/06/prince_s_death_reveals_how_wrong_our_over_reliance_on_dangerous_opioids.html"
    )
  ).toBe("at slate.com");
});

test("Only modifies the url", () => {
  expect(
    delink(
      "“The Fass and the furious: the remarkable career of Rainer Werner Fassbinder” at http://www.theguardian.com/film/2017/apr/24/rainer-werner-fassbinder-bfi-merchant-four-seasons"
    )
  ).toBe(
    "“The Fass and the furious: the remarkable career of Rainer Werner Fassbinder” at theguardian.com"
  );
});
