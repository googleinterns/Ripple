/* Contains unit tests for auth.js file. Currently has ~10% coverage (rest will be tested by Sarah).*/

const authModule = require('../webapp/auth');
const $ = require('jquery');
require('../__mocks__/localstorage');

/* Test that checks if localStorage correctly stores values if a user registers as business owner. Local storage only stores strings, so had to add check for boolean and string types */
test('setUserType: set user type when signing up', () => {
  authModule.setUserType("business");
  expect(localStorage.getItem("isBusinessOwner") === "true" || localStorage.getItem("isBusinessOwner") === true).toBeTruthy;
  
});

/* Test that checks if localStorage correctly stores values if a user registers as business owner. Local storage only stores strings, so had to add check for boolean and string types */
test('setUserType: set user type when signing up', () => {
  authModule.setUserType("community");
  expect(localStorage.getItem("isBusinessOwner") === "false" || localStorage.getItem("isBusinessOwner") === false).toBeTruthy;
});

