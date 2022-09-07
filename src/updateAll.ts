export {};

const { updateAllCitations } = require("./tasks/citations");
const { updateAllTexts } = require("./tasks/texts");

updateAllCitations();
updateAllTexts();
