const { voicedSections } = require("./voices");

var textract = require("textract");
var simpleOdf = require("simple-odf");

const { upperCase } = require("lodash");

const filePath =
  "/home/joegatt/Documents/Work/Heart of a Heartless World/Heart of a Heartless World v10.odt";

const textExtractConfig = { preserveLineBreaks: true };

const documents = {};
const documentBodies = {};

textract.fromFileWithPath(filePath, textExtractConfig, (error, text) => {
  if (error) {
    console.log(error);
    return;
  }
  const [voices, sections] = voicedSections(text);

  // Create voice documents
  voices.forEach((voice) => {
    documents[voice] = new simpleOdf.TextDocument();
    documentBodies[voice] = documents[voice].getBody();
  });

  const font = new simpleOdf.FontFace("Vollkorn");
  font.setFontFamily("Vollkorn");

  const fontFaceDeclarations = new simpleOdf.FontFaceDeclarations();
  fontFaceDeclarations.create(
    "Vollkorn",
    "Vollkorn",
    simpleOdf.FontPitch.Variable
  );

  const titleColor = simpleOdf.Color.fromHex("008000");

  // Add document content
  sections.forEach((section) => {
    const voice = section[0];
    // FIX: Not working
    // let currentChapter = 0;

    // Add document styles
    const chapterHeaderSmallStyle = documents[voice]
      .getCommonStyles()
      .createParagraphStyle("Chapter header - small");
    chapterHeaderSmallStyle.setFontName(font);
    chapterHeaderSmallStyle.setFontSize(24);
    chapterHeaderSmallStyle.setTypeface(simpleOdf.Typeface.Bold);

    const sectionDescriptorStyle = documents[voice]
      .getCommonStyles()
      .createParagraphStyle("Section descriptor");
    sectionDescriptorStyle.setFontName(font);
    sectionDescriptorStyle.setFontSize(10);
    sectionDescriptorStyle.setColor(titleColor);

    const firstParagraphStyle = documents[voice]
      .getCommonStyles()
      .createParagraphStyle("Text body - first line");
    firstParagraphStyle.setFontName(font);
    firstParagraphStyle.setFontSize(10);
    firstParagraphStyle.setHorizontalAlignment("justified");

    const paragraphStyle = documents[voice]
      .getCommonStyles()
      .createParagraphStyle("Text body");
    paragraphStyle.setFontName(font);
    paragraphStyle.setFontSize(10);
    paragraphStyle.setHorizontalAlignment("justified");
    paragraphStyle.setTextIndent(7.5);

    // Write the content
    // FIX: Not working
    // if (currentChapter !== section[3]) {
    //   documentBodies[voice]
    //     .addParagraph(`${section[2]}\n`)
    //     .setStyleName("Chapter header - small");
    //   currentChapter = section[3];
    // }
    documentBodies[voice]
      .addParagraph(`\n\n{{${section[1]}}}`)
      .setStyleName("Section descriptor");
    documentBodies[voice]
      .addParagraph(section[3].shift())
      .setStyleName("Text body - first line");
    section[3].forEach((paragraph) => {
      documentBodies[voice].addParagraph(paragraph).setStyleName("Text body");
    });
  });

  voices.forEach((voice) => {
    documents[voice]
      .saveFlat(
        `/home/joegatt/Documents/Work/Heart of a Heartless World/${upperCase(
          voice
        )} - Heart of a Heartless World v11.odt`
      )
      .then()
      .catch();
  });
});
