/* Sign up user and add data to Firestore. Does not create new document if 
existing user signs up. 
TODO: Add alert if existing user signs up. 
TODO: Get isBusinessOwner data from signup.html page */
function signUpWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('profile');
  auth.signInWithPopup(provider).then(function(result) {
    window.location = 'landingbusiness.html';
    console.log("Success: Google account linked");
    var token = result.credential.accessToken;
    var user = result.user;
    var name = user.displayName;
    var email = user.email;
    var uid = user.uid;
    var isBusinessOwner = false;
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
  });
}

/* Writes user data to firestore */
function addNewUser(uid, name, isBusinessOwner, email) {
  console.log("addNewUser("+ uid + ", " + name + ", " + isBusinessOwner + "," + email + ")");
  db.collection("users").doc(uid).set({
    uid: uid,
    name: name,
    isBusinessOwner: isBusinessOwner,
    email: email,
    address: "555 Fake Ln, Apt 102",
    // blobKey for default avatar photo
    blobKey: blob.DEFAULT_AVATAR,
  })
  .then(function(docRef) {
    console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}

/* Signs existing user into a session */
function signInWithGoogle() {
  // Signed in state will persist until user logs out 
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
      var provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).then(function(result) {
        window.location = 'landingbusiness.html';
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

/* Returns uid, name, isBusinessOwner fields of users via console.log */
function getUsersDocument() {
  db.collection("users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.data().uid);
      console.log(doc.data().name);
      console.log(doc.data().isBusinessOwner);
    });
  });
}

/* Send user a verification email */
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

/* Sign a user out of session */
function signOutUser() {
  var user = auth.currentUser;
  var name = user.displayName;
  var uid = user.uid;
  console.log("name before logout: " + name);
  console.log("uid before logout: " + uid);
  firebase.auth().signOut().then(function() {
    window.location= 'index.html';
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

/* Calls getBlobKey() if user exists */
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