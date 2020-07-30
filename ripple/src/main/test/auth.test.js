// /* Contains unit tests for script.js file */
// require('jest-localstorage-mock');
const authModule = require('../webapp/auth');

test('subtract auth', () => {
  expect(authModule.subtract(1, 2)).toBe(-1);
});

// /* Reset your localStorage data and mocks before each test to prevent leaking. */
// beforeEach(() => {
//   // values stored in tests will also be available in other tests unless you run
//   localStorage.clear();
//   // or directly reset the storage
//   localStorage.__STORE__ = {};
//   // you could also reset all mocks, but this could impact your other mocks
//   jest.resetAllMocks();
//   // or individually reset a mock used
//   localStorage.setItem.mockClear();
// });

// test('Local Storage Test #1: Set isBusinessOwner boolean based on user choice', () => {
  
//   const KEY = "isBusinessOwner";
//   const VALUE = true;
//   dispatch(action.update(KEY, VALUE));
//   expect(localStorage.setItem).toHaveBeenLastCalledWith(KEY, VALUE);
//   expect(localStorage.__STORE__[KEY]).toBe(VALUE);
//   expect(Object.keys(localStorage.__STORE__).length).toBe(1);
// });

// // test('Local Storage Test #2: Set isBusinessOwner boolean based on user choice', () => {
  
// //   spyOn(window.sessionStorage, 'setItem');
  
// //   window.sessionStorage.setItem('test', 'test2');
  
// //   expect(window.sessionStorage.setItem).toHaveBeenCalledWith('test', 'test2');
// // });