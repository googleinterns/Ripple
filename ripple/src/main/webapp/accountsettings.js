/* If applicable, blob key from URL and updates local storage and Firestore.
   Reads account name, email, user type, and blobKey from localStorage. Adds to DOM. */
function getAcctInfo() {
  // Get user id to query Firestore by doc id
  var uid = localStorage.getItem("uid");

  // If there is a blob key in the URL, update Firestore and localStorage
  var blobKey = readBlobKeyFromURl();
  if (blobKey != null) {
    // Update Firestore with the new user blob key
    db.collection("users").doc(uid).update({
      userBlobKey: blobKey,
    }).then(() => {
      console.log("Document sucessfully updated!");
    }).catch((error) => {
      console.error("Error updating document: ", error);
    })
    // Update local storage with the new user blob key
    localStorage.setItem("userBlobKey", blobKey);
  }
  // Serve user blob to avatars in nav bar and larger display
  var userBlobKey = localStorage.getItem("userBlobKey");
  serveBlob(userBlobKey, "nav-bar-avatar");
  serveBlob(userBlobKey, "profile-image");
  // Read local Storage values and add all text fields to the DOM
  var userName = localStorage.getItem("userName");
  addTextToDom(userName, "acct-name");
  var userEmail = localStorage.getItem("userEmail");
  addTextToDom(userEmail, "acct-email");
  var isBusinessOwner = localStorage.getItem("isBusinessOwner");
  if (isBusinessOwner == "true") {
    addTextToDom("Business owner", "acct-type");
  } else {
    addTextToDom("Community member", "acct-type");
  }
}
