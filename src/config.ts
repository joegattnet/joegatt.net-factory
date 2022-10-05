module.exports = {
  ALLOWED_TAGS_BODY: ["a", "ol", "ul", "li", "table", "tr", "td"],
  ALLOWED_TAGS_BLURB: [],
  BLURB_LENGTH: 50,
  DB_CONNECTION: {
    user: "deployer",
    host: "0.0.0.0",
    database: "joegattnet", // THESE SHOULDN'T BE HARDCODED!
    password: "itTieni10",
    port: 5432,
  },
  SPANNED_TAGS: ["em", "strong"],
};
