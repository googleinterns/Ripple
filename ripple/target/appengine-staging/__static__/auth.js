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
    var email = user.email;
    var isbusinessOwner = false;
    console.log("name: " + name);
    console.log("uid: " + uid);
    sendEmailVerification(uid);
    addNewUser(uid, name, isBusinessOwner, email);
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

function addNewUser(uid, name, isBusinessOwner, email) {
  console.log("addNewUser("+ uid + ", " + name + ", " + isBusinessOwner + ")");
  db.collection("users").doc(uid).set({
    uid: uid,
    name: name,
    isBusinessOwner: isBusinessOwner,
    email: email,
    // blobKey for default avatar photo
    blobKey: "XEkBWMfbItUDt70PromXrQ",
  })
  .then(function(docRef) {
    console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}

// function to sign in with Google
function signInWithGoogle() {
  // Signed in state will persist until user logs out 
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
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
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
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
  var uid = user.uid;
  console.log("name before logout: " + name);
  console.log("uid before logout: " + uid);
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

// Calls getBlobKey() if user exists
function checkUserStatus() {
  auth.onAuthStateChanged(user => {
    if (user) {
      uid = user.uid;
      console.log("Success: checkUserStatus() found user with uid: " + uid);
      getAcctInfo(uid);
    } else {
      console.log("Failure: checkUserStatus() found no user");
    }
  })
} 