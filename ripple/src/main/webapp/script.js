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

/* Display an alert if user presses enter to comment on a post */
function addComment(e) {
  comment = document.getElementById("add-comment").value;
  if (e.keyCode === 13) {
    alert("You are commenting: " + comment);
  }
}

/* creates blobstoreUrl for user profile image to firestore */
function fetchBlobstoreUploadUrl() {
  console.log("called fetchBlobstoreUpload()");
  fetch('/blobstore-upload-url')
      .then((response) => {
        return response.text();
      })
      .then((blobstoreUploadUrl) => {
        const userProfileForm = document.getElementById("user-profile-form");
        userProfileForm.action = blobstoreUploadUrl;
        console.log("fetched blobstoreUploadUrl: " + blobstoreUploadUrl);
        userProfileForm.submit();
      });
}

/* Loads camera icon on Account Settings page */
function loadAcctSettingsIcons() {
  var cameraIconBlob = blob.CAMERA_ICON;
  serveBlob(cameraIconBlob, "camera-icon-id");
}

/* Clicks button to insert file on Account Settings page */
function selectFile() {
  document.getElementById("file").click();
}

function viewAllPostComments() {
  alert("Fetch all comments for this post!");
}
