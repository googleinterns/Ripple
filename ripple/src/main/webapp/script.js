// Display an alert containing the inputted address if user presses enter
function searchAddress(e) {
  addressInput = document.getElementById("address-input").value;
  if (e.keyCode === 13) {
    alert("You are searching: " + addressInput);
  }
  return false;
}

// creates blobstoreUrl for user profile image to firestore 
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

// Loads camera icon on Account Settings page
function loadAcctSettingsIcons() {
  serveBlob("faPTsRMvclAqSSbJsMXYwQ", "camera-icon-id");
}

// Clicks button to insert file on Account Settings page
function selectFile() {
  document.getElementById("file").click();
}