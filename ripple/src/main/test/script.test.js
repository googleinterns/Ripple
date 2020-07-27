/* Contains unit tests for script.js file */

const scriptsModule = require('../webapp/script');

test('convertToRawString: test #1 empty str', () => {
  expect(scriptsModule.convertToRawString("")).toBe("");
});

test('convertToRawString: test #2 str contains a space', () => {
  expect(scriptsModule.convertToRawString(" ")).toBe("");
});

test('convertToRawString: test #3 Does not accept non-string type int', () => {
  expect(scriptsModule.convertToRawString(12345)).toBeFalsy;
});

test('convertToRawString: test #4 Does not accept non-string type null', () => {
  expect(scriptsModule.convertToRawString()).toBeFalsy;
});

test('convertToRawString: test #5 Converts to upper case w/o spaces or special characters', () => {
  expect(scriptsModule.convertToRawString("Cup Cakin' & Bake")).toBe("CUPCAKINBAKE");
});

test('convertToRawString: test #6 Converts accented characters to ascii', () => {
  expect(scriptsModule.convertToRawString("á, é, í, ó, ú, ü, ñ, ¿, ¡")).toBe("AEIOUUN");
});