/* Contains unit tests for script.js file */

const scriptsModule = require('../webapp/script');

test('adds 1 + 2 to equal 3', () => {
  expect(scriptsModule.sum(1, 2)).toBe(3);
});

test('multiplies 1 * 2 to equal 2', () => {
  expect(scriptsModule.multiply(1, 2)).toBe(2);
});