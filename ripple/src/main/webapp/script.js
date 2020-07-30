/* Blobstore, post, and generally-used functions. */

/* Given blob key and image id, inserts image from Blobstore */
function serveBlob(blobKey, imageId) {
  const image = document.getElementById(imageId);
  image.src = "/serve?blob-key=" + blobKey;
}

/* Define global variable for key press */
var ENTER_KEY = 13;


/* Display an alert if user presses enter to comment on a post */
function addComment(e) {
  comment = document.getElementById("add-comment").value;
  if (e.keyCode === ENTER_KEY) {
    alert("You are commenting: " + comment);
  }
}

/* Creates blobstoreUrl for image to firestore */
function fetchBlobstoreUploadUrl(formId, fileId, webUrl) {
  console.log("called fetchBlobstoreUploadUrl(" + formId + ", " + fileId + ", " + webUrl + ")");
  fetch('/blobstore-upload-url?file-id=' + fileId + '&web-url=' + webUrl).then((response) => {
    return response.text();
  }).then((blobstoreUploadUrl) => {
    const form = document.getElementById(formId);
    form.action = blobstoreUploadUrl;
    console.log("fetched blobstoreUploadUrl: " + blobstoreUploadUrl);
    form.submit();
  });
} 

/* Return blob key from the URL */
function readBlobKeyFromURl() {
  var blobKey = getParameterByName("blob-key");
  console.log("Parameter blobKey: " + blobKey);
  return blobKey;
}

/* Read parameter in URL of window. */
function getParameterByName(name) {
  console.log("called getParameterByName()");
  url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  // Define search pattern to start parsing URL at '?' or '&', match the name
  // specified by the parameter, and retrieve the value that follows a special character
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/* Retrieve a doc by docId */
function getDocByDocId(collection, docId, lambda, varArray=false) {
  db.collection(collection).doc(docId).get()
  .then(lambda)
  .catch((error) => {
    console.log("Error getting document:", error);
  });
}

/* Retrieve a doc by query once OR as a snapshot
   Method accepts either "get" or "snapshot" and filters according to parameters */
function getOrSnapshotDocsByQuery(method, collection, lambda, whereFieldArray,
    whereValueArray, orderByField=false, orderDirection=false, varArray=false) {
  var ref = db.collection(collection);
//   Filter by fields
  i = 0;
  while (i < whereFieldArray.length) {
    console.log("filter by fields: where " + whereFieldArray[i] + " == " + whereValueArray[i]);
    ref = ref.where(whereFieldArray[i], "==", whereValueArray[i]);
    // Use prefix increment
    i = ++i;
  }
  // Sort query
  if (orderByField != false) {
    if (orderDirection != false) {
      ref = ref.orderBy(orderByField, orderDirection);
    } else {
      ref = ref.orderBy(orderByField);
    }
  }
  // Get documents based on method get or snapshot
  if (method == "get") {
    ref.get()
    .then(lambda);
  } else { // method == "snapshot"
    ref.onSnapshot(lambda)
    .catch((error) => {
      console.log("Error getting document:", error);
    }) 
  }
}

/* Given text and an id, function adds text to DOM */
function addTextToDom(text, id) {
  var element = document.getElementById(id);
  element.innerText = text;
}

/* Given an id, function displays a hidden element */
function displayElement(id) {
  var element = document.getElementById(id);
  element.style.display = "block";
}

/* Loads camera icon on Account Settings page */
function loadAcctSettingsIcons() {
  var cameraIconBlob = blob.CAMERA_ICON;
  serveBlob(cameraIconBlob, "camera-icon-id");
}

/* Clicks button to insert an image file */
function selectFile(fileId) {
  console.log("fileId: " + fileId);
  document.getElementById(fileId).click();
}

function viewAllPostComments() {
  alert("Fetch all comments for this post!");
}

/* Backend for search functionality */

var searchString = document.getElementById("search-bar");
document.addEventListener('keyup', searchInput);

/* Takes navbar search input, stores in session storage. */
function searchInput(keyPress) {
  var searchString = document.getElementById("search-bar").value;
  console.log(searchString)
  if (keyPress.keyCode != ENTER_KEY) {
    autocompleteSearch(searchString);
  } else {
    console.log(searchString);
    localStorage.setItem("galleryPageSearchTag", searchString);
    localStorage.setItem("galleryPageName", "'" + searchString + "'");
    window.location.assign("businessgallery.html");
  }
  return false;
}

/* Function to perform search autocomplete. Calls trie to get autocomplete words. */
function autocompleteSearch(searchString) {
    rawString = convertToRawString(searchString);
    autoOptions = trie.getWords(rawString, 5);
    var options = '';
    for(var i = 0; i < autoOptions.length; i++) {
      option = tagsDict[autoOptions[i]]
      options += '<option value="'+option+'" />';
    }
    
  document.getElementById('search-autocomplete').innerHTML = options;
}

/* Given a formatted user string, converts it to uppercase, removes special characters, 
   converts accented characters to ascii. */
function convertToRawString(str) {
  if (typeof str === "string") {
    var strUpper = str.toUpperCase();
    // Normalize to NFD & use regex to remove diacritics. Remove special chars.
    return strUpper.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\W/g, ''); 
  } else {
    return false;
  }
}

/* Clicks button given id */
function clickElement(id) {
  document.getElementById(id).click();
}

/* Hides element given an id */
function hideElement(id) {
  document.getElementById(id).style.display = "none";
}

/* Removes disabled attribute from element given an id */
function enableElement(id) {
  document.getElementById(id).disabled = false;
}

// Unit testing exports set up

module.exports = { 
  convertToRawString: convertToRawString,
  serveBlob: serveBlob,
  getParameterByName: getParameterByName,
  addTextToDom: addTextToDom,
  displayElement: displayElement,
  hideElement: hideElement,
  enableElement: enableElement,
  searchInput: searchInput,
}
