/* Contains unit tests for auth.js file. Currently has ~10% coverage (rest will be tested by Sarah).*/

const authModule = require('../webapp/auth');
const $ = require('jquery');
require('../__mocks__/localstorage');
const sinon = require('../node_modules/sinon/pkg/sinon.js');

/* Test that checks if localStorage correctly stores values if a user registers as business owner. */
test('setUserType: test #1 set user type when signing up', () => {
  localStorage.clear();
  authModule.setUserType("business");
  expect(localStorage.getItem("isBusinessOwner")).toBeTruthy;
});

/* Test that checks if localStorage correctly stores values if a user registers as community member. */
test('setUserType: test #2 set user type when signing up', () => {
  localStorage.clear();
  authModule.setUserType("community");
  expect(localStorage.getItem("isBusinessOwner")).toBeFalsy;
});

/* Test that checks if localStorage correctly stores uid, userName, isBusinessOwner, userBlobKey */
test('setLocalStorageFromSignIn: test #1 (isBusinessOwner set to be true)', () => {
  localStorage.clear();
  // Check that local storage is null. 
  expect(localStorage.getItem("uid")).toBe(null);
  expect(localStorage.getItem("userName")).toBe(null);
  expect(localStorage.getItem("isBusinessOwner")).toBe(null);
  expect(localStorage.getItem("userBlobKey")).toBe(null);
  var uid = "myUserId12345";
  var userName = "Astrid Poli";
  var isBusinessOwner = true;
  var userBlobKey = "userBlobKey12345";
  authModule.setLocalStorageFromSignIn(uid, userName, isBusinessOwner, userBlobKey);
  expect(localStorage.getItem("uid")).toBe("myUserId12345");
  expect(localStorage.getItem("userName")).toBe("Astrid Poli");
  expect(localStorage.getItem("isBusinessOwner")).toBeTruthy;
  expect(localStorage.getItem("userBlobKey")).toBe("userBlobKey12345");
});

/* Test that checks if localStorage correctly stores values */
test('setLocalStorageFromSignIn: test #2 (isBusinessOwner set to be false)', () => {
  localStorage.clear();
  var uid = "anotherUserId12345";
  var userName = "Pamela Poli";
  var isBusinessOwner = false;
  var userBlobKey = "anotherUserBlobKey12345";
  authModule.setLocalStorageFromSignIn(uid, userName, isBusinessOwner, userBlobKey);
  expect(localStorage.getItem("uid")).toBe("anotherUserId12345");
  expect(localStorage.getItem("userName")).toBe("Pamela Poli");
  expect(localStorage.getItem("isBusinessOwner")).toBeFalsy;
  expect(localStorage.getItem("userBlobKey")).toBe("anotherUserBlobKey12345");
});