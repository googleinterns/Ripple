/* Carousel function that allows cards to move to the left or right by one. */
$("#cardCarousel").on("slide.bs.carousel", function(e) {
  var $e = $(e.relatedTarget);
  var idx = $e.index();
  var itemsPerSlide = 3;
  var totalItems = $(".carousel-item").length;

  if (idx >= totalItems - (itemsPerSlide - 1)) {
    var it = itemsPerSlide - (totalItems - idx);
    for (var i = 0; i < it; i++) {
      // append slides to end
      if (e.direction == "left") {
        $(".carousel-item")
          .eq(i)
          .appendTo(".carousel-inner");
      } else {
        $(".carousel-item")
          .eq(0)
          .appendTo($(this).find(".carousel-inner"));
      }
    }
  }
});

/* Display an alert containing the inputted address if user presses enter */
function searchAddress(e) {
  addressInput = document.getElementById("address-input").value;
  if (e.keyCode === 13) {
    alert("You are searching: " + addressInput);
    window.location.assign("main.html");
  }
  return false;
}

/* Given blob key and image id, inserts image from Blobstore */
function serveBlob(blobKey, imageId) {
  const image = document.getElementById(imageId);
  image.src = '/serve?blob-key=' + blobKey;
}

/* creates blobstoreUrl for image to firestore */
function fetchBlobstoreUploadUrl(formId, fileId, webUrl) {
  console.log("called fetchBlobstoreUploadUrl(" + formId + ", " + fileId + ", " + webUrl + ")");
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

/* Serves blob by parsing blobKey from parameter. If no parameter, serves stored blob. */
function getBlobKey(uid, blobKey) {
  var newBlobKey = getParameterByName('blob-key');
  console.log("Parameter blobKey: " + newBlobKey);
  // New image uploaded. Store blobkey in firestore.
  if (newBlobKey != null) {
    console.log("New image. Blobkey parameter: ", newBlobKey);
    db.collection("users").doc(uid).update({
      blobKey: newBlobKey,
    })
        .then(function() {
        console.log("Document successfully updated!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    serveBlob(newBlobKey, "nav-bar-avatar");
    serveBlob(newBlobKey, "profile-image");
  } else {
    console.log("firestore blobKey: " + blobKey);
    serveBlob(blobKey, "nav-bar-avatar");
    serveBlob(blobKey, "profile-image");
  }
}

/* Read parameter in URL of window */
function getParameterByName(name) {
  console.log('called getParameterByName()');
  url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
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
  console.log("fileId: " + fileId)
  document.getElementById(fileId).click();
}

