/* Contains unit tests for posts.js file */

const postsModule = require('../webapp/posts');

test('subtract 1 & 2 to equal -1', () => {
  expect(postsModule.subtract(1, 2)).toBe(-1);
});