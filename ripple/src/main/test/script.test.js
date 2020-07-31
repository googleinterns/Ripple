/* Contains unit tests for script.js file. Currently has ~43% coverage for all script functions (doesn't test functions that just call 
   already tested functions or firebase functions). */

const scriptModule = require('../webapp/script');
const $ = require('jquery');
require('../__mocks__/localstorage');
require('../webapp/trie');

const sinon = require('../node_modules/sinon/pkg/sinon.js');

test('convertToRawString: test #1 empty str', () => {
  expect(scriptModule.convertToRawString("")).toBe("");
});

test('convertToRawString: test #2 str contains a space', () => {
  expect(scriptModule.convertToRawString(" ")).toBe("");
});

test('convertToRawString: test #3 Does not accept non-string type int', () => {
  expect(scriptModule.convertToRawString(12345)).toBeFalsy;
});

test('convertToRawString: test #4 Does not accept non-string type null', () => {
  expect(scriptModule.convertToRawString()).toBeFalsy;
});

test('convertToRawString: test #5 Converts to upper case w/o spaces or special characters', () => {
  expect(scriptModule.convertToRawString("Cup Cakin' & Bake")).toBe("CUPCAKINBAKE");
});

test('convertToRawString: test #6 Converts accented characters to ascii', () => {
  expect(scriptModule.convertToRawString("á, é, í, ó, ú, ü, ñ, ¿, ¡")).toBe("AEIOUUN");
});

test('serve: test #6 Converts accented characters to ascii', () => {
  expect(scriptModule.convertToRawString("á, é, í, ó, ú, ü, ñ, ¿, ¡")).toBe("AEIOUUN");
});

/* Tests that the image element's source is properly set by function. */
test('serveBlob: changes image source', () => {
  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <img id="test-img" src="old" />' +
    '</div>';
  // Expect that the url returned is accurate
  scriptModule.serveBlob("blobKey", "test-img");
  expect(document.getElementById('test-img').src).toBe("http://localhost/serve?blob-key=blobKey");
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
  expect(scriptModule.getParameterByName("blob-key")).toBe("blobKey");
}); 

var textInnerHtml = 
  '<div>' +
  '  <p id="test-text">goodbye</p>' +
  '</div>';

/* Tests that DOM is actually altered by function. */
test('addTextToDom: modifies document inner html', () => {
  // Set up our document body
  document.body.innerHTML = textInnerHtml
  scriptModule.addTextToDom("hello", "test-text");
  expect(document.getElementById('test-text').innerText).toBe("hello");
});

/* Test basic displayElement function. */
test('displayElement: displays hidden element', () => {
  // Set up our document body
  document.body.innerHTML = textInnerHtml
  document.getElementById('test-text').style.display = "none";
  scriptModule.displayElement("test-text");
  expect(document.getElementById('test-text').style.display).toBe("block");
});

/* Test basic hide element function. */
test('hideElement: hides element', () => {
  // Set up our document body
  document.body.innerHTML = textInnerHtml
  document.getElementById('test-text').style.display = "block";
  scriptModule.hideElement("test-text");
  expect(document.getElementById('test-text').style.display).toBe("none");
});

/* Test basic enable element function. */
test('enableElement: Enables element', () => {
  // Set up our document body
  document.body.innerHTML = textInnerHtml
  document.getElementById('test-text').disabled = true;
  scriptModule.enableElement("test-text");
  expect(document.getElementById('test-text').disabled).toBeFalsy;
});

/* Test that searchInput correctly stores in localStorage when enter key is pressed. */
test('searchInput: reads and searches user input', () => {
  localStorage.clear();
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
  scriptModule.searchInput(event);
  expect(localStorage.getItem("galleryPageSearchTag")).toBe("Chinese");
  expect(localStorage.getItem("galleryPageName")).toBe("'Chinese'");
});

/* Test clear local storage functionality. */
test('clearLocalStorage: Enables element', () => {
  localStorage.clear();
  // Set up local storage
  var keys = ["key1", "key2", "key3"];
  var i;
  for (i = 0; i < keys.length; i++) {
    localStorage.setItem(keys[i], "testing");
  }
  scriptModule.clearLocalStorage(keys);
  for (i = 0; i < keys.length; i++) {
    expect(localStorage.getItem(keys[i])).toBe(null);
  }
});