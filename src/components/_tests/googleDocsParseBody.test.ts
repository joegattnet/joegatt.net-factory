// import fs from 'fs';
// const googleDocsParseBody = require('./../googleDocsParseBody');

// fs.readFileSync('./mocks/googleDocsParseBody.json', (errorJson: string, mockJson: JSON) => {
//   if (errorJson) return console.log(`JSON not read: "${errorJson}".`);
//   fs.readFile('./mocks/googleDocsParseBody.txt', (errorText, mockExpectedContent) => {
//     if (errorText) return console.log(`Text not read: "${errorText}".`);
//     test("Trims multiple spaces", () => {
//       const { bodyText, evernoteId } = googleDocsParseBody(mockJson);
//       expect(bodyText).toBe(mockExpectedContent);
//       expect(evernoteId).toBe('1234567890');
//     });
//   });
// });
