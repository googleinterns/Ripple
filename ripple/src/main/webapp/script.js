/* Blobstore and post functions. */

/* Display an alert if user presses enter to comment on a post */
function addComment(e) {
  comment = document.getElementById("add-comment").value;
  if (e.keyCode === 13) {
    alert("You are commenting: " + comment);
  }
}

/* creates blobstoreUrl for image to firestore */
function fetchBlobstoreUploadUrl(formId, fileId, webUrl) {
  fetch('/blobstore-upload-url?file-id=' + fileId + '&web-url=' + webUrl)
      .then((response) => {
        return response.text();
      })
      .then((blobstoreUploadUrl) => {
        const form = document.getElementById(formId);
        form.action = blobstoreUploadUrl;
        console.log("fetched blobstoreUploadUrl: " + blobstoreUploadUrl);
        form.submit();
      });
}

/* Loads camera icon on Account Settings page */
function loadAcctSettingsIcons() {
  var cameraIconBlob = blob.CAMERA_ICON;
  serveBlob(cameraIconBlob, "camera-icon-id");
}

/* Clicks button to insert file on Account Settings page */
function selectFile(fileId) {
  document.getElementById(fileId).click();
}

function viewAllPostComments() {
  alert("Fetch all comments for this post!");
}

/* Backend for search functionality */

var ENTER_KEY = 13;
/* Takes navbar search input, stores in session storage. */
function searchInput(keyPress) {
    if (keyPress.keyCode === ENTER_KEY) {
      var searchString = document.getElementById('search-bar').value;
      console.log(searchString);
      localStorage.setItem('searchString', searchString);
      localStorage.setItem('galleryPageName', searchString);
      window.location.assign("businessgallery.html");
    } else {
        return false;
    }
}