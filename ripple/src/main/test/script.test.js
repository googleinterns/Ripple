/* Contains unit tests for script.js file. Currently has ~50% coverage for all script functions (doesn't test functions that just call 
   already tested functions or firebase functions). */

const scriptsModule = require('../webapp/script');
const $ = require('jquery');
require('../__mocks__/localstorage');
require('../webapp/trie');

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

test('serve: test #6 Converts accented characters to ascii', () => {
  expect(scriptsModule.convertToRawString("á, é, í, ó, ú, ü, ñ, ¿, ¡")).toBe("AEIOUUN");
});

/* Tests that the image element's source is properly set by function. */
test('serveBlob: changes image source', () => {
  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <img id="test-img" src="old" />' +
    '</div>';
  // Expect that the url returned is accurate
  scriptsModule.serveBlob("blobKey", "test-img");
  expect(document.getElementById('test-img').src).toEqual("http://localhost/serve?blob-key=blobKey");
});

/* Tests that the function reads the url and retrieves the blob key correctly. */
test('getParameterByName: reads the blob key from the url', () => {
  // Set up window.href
  global.window = Object.create(window);
  const url = "http://localhost/serve?blob-key=blobKey";
  Object.defineProperty(window, 'location', {
      value: {
      href: url
    }
  });
  // Expect that the regex retrieves the correct parameter string
  expect(scriptsModule.getParameterByName("blob-key")).toEqual("blobKey");
}); 

/* Tests that DOM is actually altered by function. */
test('addTextToDom: modifies document inner html', () => {
  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <p id="test-text">goodbye</p>' +
    '</div>';
  scriptsModule.addTextToDom("hello", "test-text");
  expect(document.getElementById('test-text').innerText).toEqual("hello");
});

/* Test basic displayElement function. */
test('displayElement: displays hidden element', () => {
  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <p id="test-text">goodbye</p>' +
    '</div>';
  document.getElementById('test-text').style.display = "none";
  scriptsModule.displayElement("test-text");
  expect(document.getElementById('test-text').style.display).toEqual("block");
});

/* Test basic hide element function. */
test('hideElement: hides element', () => {
  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <p id="test-text">goodbye</p>' +
    '</div>';
  document.getElementById('test-text').style.display = "block";
  scriptsModule.hideElement("test-text");
  expect(document.getElementById('test-text').style.display).toEqual("none");
});

/* Test basic enable element function. */
test('enableElement: Enables element', () => {
  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <p id="test-text">goodbye</p>' +
    '</div>';
  document.getElementById('test-text').disabled = true;
  scriptsModule.enableElement("test-text");
  expect(document.getElementById('test-text').disabled).toBeFalsy;
});

/* Test that searchInput correctly stores in localStorage when enter key is pressed. */
test('searchInput: reads and searches user input', () => {
  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <input id="search-bar"></input>' +
    '</div>';

  document.getElementById("search-bar").value = "Chinese";
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
  var event = new KeyboardEvent('keyup', {'keyCode': 13});
  document.dispatchEvent(event);
  scriptsModule.searchInput(event);
  expect(localStorage.getItem("galleryPageSearchTag")).toEqual("Chinese");
  expect(localStorage.getItem("galleryPageName")).toEqual("'Chinese'");
});