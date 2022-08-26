exports.voicedSections = (text) => {
  const voices = [];
  const voicedSections = [];

  // Reinstate things lost in text extraction
  // FIX: not working
  // text.replace(/'/gm, "’");

  const chapters = text.split("{{***}}");

  chapters.shift();
  chapters.forEach((chapter, chapterIndex, array) => {
    const sections = chapter.split("{{");
    const voiceCounter = {};

    // Get voices
    sections.forEach((section, sectionIndex, array) => {
      [sectionName, sectionText] = section.split("}}");
      cleanedSectionName = sectionName.replace(/[ \d\*]/g, "");

      if (cleanedSectionName && sectionText) {
        !voices.includes(cleanedSectionName) && voices.push(cleanedSectionName);

        voiceCounter[cleanedSectionName] = !!voiceCounter[cleanedSectionName]
          ? voiceCounter[cleanedSectionName] + 1
          : 1;

        const paragraphs = sectionText.trim().split(/\n+/);

        // Split content by voice
        voicedSections.push([
          cleanedSectionName,
          `${String(chapterIndex).padStart(2, "0")} ${String(
            sectionIndex
          ).padStart(2, "0")} ${sectionName} ${String(
            voiceCounter[cleanedSectionName]
          ).padStart(2, "0")}`,
          chapterIndex,
          paragraphs,
        ]);
      }
    });
  });
  return [voices, voicedSections];
};
