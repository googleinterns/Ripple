/* Contains unit tests for landing.js file. Currently has 50% coverage overall and 100% coverage on 
   functionality written by us. (Places API functionality should work without tests). */

const landingModule = require('../webapp/landing');
const $ = require('jquery');
require('../__mocks__/localstorage');


/* Test that address is correctly stored in localStorage when function is called. */
test('searchAddress: reads and stores user address input', () => {
  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <input id="address-input"></input>' +
    '</div>';

  document.getElementById("address-input").value = "2732 Haste Street, Berkeley, CA";

  // Set up window.href
  global.window = Object.create(window);
  const url = "http://localhost/";
  Object.defineProperty(window, 'location', {
      value: {
      href: url,
    }
  });
  window.location.assign = jest.fn();

  // Call function with enter key input
  var ENTER_KEY = 13;
  var event = new KeyboardEvent('keyup', {'keyCode': ENTER_KEY});
  document.dispatchEvent(event);
  landingModule.searchAddress(event);
  expect(localStorage.getItem("inputAddress")).toBe("2732 Haste Street, Berkeley, CA");
});