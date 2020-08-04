/* Contains generalized functions to be used across multiple html and js files. */

/* Detemine user type and grant corresponding levels of functionality in the nav bar */
function navbarDisplay() {
  /* Determine user type and returns true for business owner, 
   false for community member, null for anonymous user  */
  var userType = localStorage.getItem("isBusinessOwner");
  console.log("userType: " + userType);
  var userBlobKey = localStorage.getItem("userBlobKey");
  console.log("userBlobKey: " + userBlobKey);
  var content;
  if (userType == null) {
    console.log("entered userType null loop");
    content = `
      <ul class="navbar-nav">
        <li class="nav-item active">
          <a class="nav-link login-chip" href="login.html">Log in</a>
        </li>
      </ul>
    `;
    $("#today").addClass("today-padding");
  } else if (userType == "false") { // Community member: avatar + 2 item drop down
  console.log("entered userType false loop");
    content = `
      <ul class="navbar-nav nav-flex-icons">
        <li class="nav-item avatar dropdown">
          <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink-55" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
            <img id="nav-bar-avatar" src="/serve?blob-key=${userBlobKey}" class="rounded-circle z-depth-0">
          </a>
          <div class="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
              aria-labelledby="navbarDropdownMenuLink-55">
            <a class="dropdown-item" href="accountsettings.html">Account settings</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item semi-bold-text" onclick="signOutUser()">Log out</a>
          </div>
        </li>
      </ul>
    `;
  } else if (userType == "true") { // Business owner: avatar + 3 item drop down
  console.log("entered userType true loop");
    content = `
      <ul class="navbar-nav nav-flex-icons">
        <li class="nav-item avatar dropdown">
          <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink-55" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
            <img id="nav-bar-avatar" src="/serve?blob-key=${userBlobKey}" class="rounded-circle z-depth-0">
          </a>
          <div class="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
              aria-labelledby="navbarDropdownMenuLink-55">
            <a class="dropdown-item" href="managebusinessinfo.html">Manage business</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="accountsettings.html">Account settings</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item semi-bold-text" onclick="signOutUser()">Log out</a>
          </div>
        </li>
      </ul>
    `;
  } else {
    console.log("Error: User type is defined incorrectly");
  }
  userOptionsElement = document.getElementById("user-options");
  userOptionsElement.innerHTML = content;
}

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

/* Given text and an id, function adds href to a tag in DOM */
function addHrefToDom(href, id) {
var element = document.getElementById(id); //or grab it by tagname etc
element.href = href;
}

/* Given an id, function displays a hidden element */
function displayElement(id) {
  var element = document.getElementById(id);
  element.style.display = "block";
}
function hideElement(id) {
  var element = document.getElementById(id);
  element.style.display = "none";
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
searchString.addEventListener('keyup', searchInput);

// /* Takes navbar search input, stores in session storage. */
function searchInput(keyPress) {
  console.log("searchInput() called");
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

// /* Function to perform search autocomplete. Calls trie to get autocomplete words. */
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
  alert("enabling element: " + id);
  document.getElementById(id).disabled = false;
}

function clearLocalStorage(arrayKeys) {
  arrayKeys.forEach((key) => {
    console.log("Removing from localStorage: " + key + ", " + localStorage.getItem(key));
    localStorage.removeItem(key);
  });
}

/* Function parses "Wed Jul 01 2020 12:00:00 GMT-0700 (Pacific Daylight Time)" to 
   "July 1, 2020" */ 
function parseDate(rawDate) {
  console.log("rawDate: " + rawDate);
  console.log(typeof rawDate);
  var rawDateArray = rawDate.split(" ");
  var month = formatMonth(rawDateArray[1]);
  var day = formatDay(rawDateArray[2]);
  var year = rawDateArray[3];
  formattedDate = month + " " + day + ", " + year;
  return formattedDate;
}

/* Takes in an abbreviated month and outputs the unabbreviated month */
function formatMonth(month) {
  var formattedMonth;
  if (month == "Jan") {
    formattedMonth = "January";
  } else if (month == "Feb") {
    formattedMonth = "February";
  } else if (month == "Mar") {
    formattedMonth = "March";
  } else if (month == "Apr") {
    formattedMonth = "April";
  } else if (month == "May") {
    formattedMonth = month;
  } else if (month == "Jun") {
    formattedMonth = "Jun";
  } else if (month == "Jul") {
    formattedMonth = "July";
  } else if (month == "Aug") {
    formattedMonth = "August";
  } else if (month == "Sep") {
    formattedMonth = "September";
  } else if (month == "Oct") {
    formattedMonth = "October";
  } else if (month == "Nov") {
    formattedMonth = "November";
  } else if (month == "Dec") {
    formattedMonth = "December";
  } else {
    console.log("Error: month" + month);
    return false;
  }
  return formattedMonth;
}

/* Checks if Day string has a leading 0. If so, remove 0 and return remaining string
   Ex: "01* should output "1" */
function formatDay(rawDay) {
  var formattedDay;
  if (rawDay.charAt(0) == "0") {
    var formattedDay = rawDay.substring(1);
    console.log("formattedDay: " + formattedDay);
    return formattedDay;
  } else {
    return rawDay;
  }
}

/* Escapes special characters and returns formatted string*/
function escapeSpecialCharacters(str) {
  console.log("[BEFORE] str: " + str);
  // Replace " with two ' b/c " cannot be escaped properly in output onto DOM
  // Search for special characters \, ', (, ) globally in string
  // and insert a forward slash \ to escape those characters
  str = str.replace(/\"/gi,'\'\'').replace(/[\\\'()]/gi, '\\$&');
  console.log("[AFTER ] str: " + str);
  return str;
}

/* Given a target value, returns true if target is 
   within startRange (exclusive) & endRange (exclusive) */
function isWithinRange(target, startRange, endRange, lessThanAndEquals=false) {
  if (typeof target === "number" && typeof startRange === "number" && 
      typeof endRange === "number") {
        // if lessThanAndEquals is true, first default operator checks if startRange <= target
        if (lessThanAndEquals) {
          console.log("check within range: " + startRange + " <= " + target + " < " + endRange);
          if ((startRange <= target) && (target < endRange)) {
            return true;
          } else {
            return false;
          }
        }
        console.log("check within range: " + startRange + " < " + target + " < " + endRange);
        // Otherwise, first default operator checks if startRange < target
        if ((startRange < target) && (target < endRange)) {
          return true;
        } else {
          return false;
        }
  }
  return false;
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
  clearLocalStorage: clearLocalStorage,
}
