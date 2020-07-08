// function to sign up with Google
function signUpWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('profile');
  auth.signInWithPopup(provider).then(function(result) {
    // window.location = 'landingbusiness.html';
    console.log("Success: Google account linked");
    var token = result.credential.accessToken;
    var user = result.user;
    var name = user.displayName;
    var uid = user.uid;
    var businessOwner = false;
    console.log("name: " + name);
    console.log("uid: " + uid);
    sendEmailVerification();
    addNewUser(uid, name, businessOwner);
  }).catch(function(error) {
    console.log(error);
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    // ...
  });
}

function addNewUser(uid, name, businessOwner) {
  console.log("addNewUser("+ uid + ", " + name + ", " + businessOwner);
  db.collection("users").add({
    uid: uid,
    name: name,
    businessOwner: businessOwner
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}

// function to sign in with Google
function signInWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(function(result) {
    // window.location = 'landingbusiness.html';
    console.log("Success: Google account linked");
    var token = result.credential.accessToken;
    var user = result.user;
    var uid = user.uid;
    getUsersDocument();
  }).catch(function(error) {
    console.log(error);
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    // ...
  });
}

// Returns uid, name, businessOwner fields of users via console.log
function getUsersDocument() {
  db.collection("users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.data().uid);
      console.log(doc.data().name);
      console.log(doc.data().businessOwner);
    });
  });
}

// Send user a verification email
function sendEmailVerification() {
  var user = auth.currentUser;
  user.sendEmailVerification().then(function() {
    // Email sent.
    console.log("Success: email sent to user");  
  }).catch(function(error) {
    // An error happened.
    console.log("Error: email not sent to user"); 
  });
}

// Sign out a user
function signOutUser() {
  var user = auth.currentUser;
  var name = user.displayName;
  console.log("name before logout: " + name);
  firebase.auth().signOut().then(function() {
    // window.location= 'index.html';
    console.log("Auth state change success: user logged out");
    user = auth.currentUser;
    if (user == null) {
      console.log("Success: no user found");
    } else {
      console.log("Error: user is not null");
    }
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
}

// Listen for auth status changes via console.log
auth.onAuthStateChanged(user => {
  console.log("onAuthStateChanged: " + user);
})

// Adds blobkey for user profile image to firestore 
function uploadUserProfileImage() {
  console.log("Success: called uploadUserProfileImage()");

  fetch('/blobstore-upload-url')
      .then((response) => {
        return response.text();
      })
      .then((imageUploadUrl) => {
        console.log(imageUploadUrl);
      });
}