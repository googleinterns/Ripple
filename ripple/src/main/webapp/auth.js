/* Set the user type when user signs up in local storage */
function setUserType(userType) {
  if (userType == "business") {
    // Set local storage
    localStorage.setItem("isBusinessOwner", true);
  } else { // Assume userType == community member
    // Set local storage
    localStorage.setItem("isBusinessOwner", false);
  }
}

/* Generates Google pop up to sign in and adds user credentials to Firebase auth 
   User stays logged in until they choose to log out */
function openGooglePopUp(authMethod) {
  // Signed in state will persist until user logs out 
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
      var user = result.user;
      var uid = user.uid;
      if (authMethod == "signUp") {
        handleSignUpWithGoogle(user, uid);
      } else {
        handleSignInWithGoogle(user, uid);
      }
    }).catch((error) =>  {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

/* If user already made an account, send an alert message.
   Otherwise, authenticate user to Fireabse and send an email verifiation */
function handleSignUpWithGoogle(user, uid) {
  var lambda = (doc) => {
        // If user already has made an account, send an alert
        if (doc.exists) {
            displayElement("signup-method-subtitle")
            // Logging in through Firebase pop up automatically authenticates user
            // for local session. Sign user out because they should not yet exist.
            signOutUser(false);
        } else { // User has not yet made an account
          console.log("Success: Google account linked");
          var userName = user.displayName;
          var email = user.email;
          var isBusinessOwner = localStorage.getItem("isBusinessOwner");
          console.log("isBusinessOwner: " + isBusinessOwner);
          // local storage returns a string. Convert to boolean
          if (isBusinessOwner == "true") {
            isBusinessOwner = true;
          } else {
            isBusinessOwner = false;
          }
          console.log("userName: " + userName);
          console.log("uid: " + uid);
          sendEmailVerification(user);
          addNewUser(uid, userName, isBusinessOwner, email);
          signOutUser(false);
        }
      }
  getDocByDocId("users", uid, lambda);
}

/* If user already has NOT made an account, send an alert message.
   Otherwise, authenticate user to Fireabse and send an email verifiation */
function handleSignInWithGoogle(user, uid) {
  var lambda = (doc) => {
        if (doc.exists) {
          // Confirm that user has verified their email
          var isEmailVerified = firebase.auth().currentUser.emailVerified;
          console.log("isEmailVerified: " + isEmailVerified);
          if (isEmailVerified == false) {
            // Display alert
            displayElement("verify-login-subtitle");
          } else {
            // Store uid and business type
            var userName = doc.data().userName;
            var isBusinessOwner = doc.data().isBusinessOwner;
            var userBlobKey = doc.data().userBlobKey;
            var userEmail = doc.data().email;
            setLocalStorageFromSignIn(uid, userName, isBusinessOwner, userBlobKey, userEmail);
            window.location = "index.html";
            console.log("Success: Google account linked");
          }
        } else {
          displayElement("login-subtitle");
          signOutUser(false);
        }
      }
  getDocByDocId("users", uid, lambda);
}

function setLocalStorageFromSignIn(uid, userName, isBusinessOwner, userBlobKey, userEmail) {
  localStorage.setItem("uid", uid);
  localStorage.setItem("userName", userName);
  localStorage.setItem("isBusinessOwner", isBusinessOwner);
  localStorage.setItem("userBlobKey", userBlobKey);
  localStorage.setItem("userEmail", userEmail);
  console.log("From local storage: " + localStorage.getItem("uid") + ", " + 
      localStorage.getItem("userName") + ", " + localStorage.getItem("isBusinessOwner")
       + ", " + localStorage.getItem("userBlobKey") + ", " + localStorage.getItem("userEmail"));
}

/* Writes user data to firestore */
function addNewUser(uid, userName, isBusinessOwner, email) {
  console.log("addNewUser("+ uid + ", " + userName + ", " + isBusinessOwner + "," + email + ")");
  db.collection("users").doc(uid).set({
    uid: uid,
    userName: userName,
    isBusinessOwner: isBusinessOwner,
    email: email,
    userBlobKey: blob.DEFAULT_AVATAR,
  })
  .then((docRef) => {
    console.log("Document successfully written!");
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });
}
 
/* Send user a verification email */
function sendEmailVerification(user) {
  var actionCodeSettings = {
    // URL is specific to Sarah's local dev server. TODO: generalize for deployed website.
    url: 'https://8080-90078eb5-4ff3-4249-9350-838131c19af3.us-west1.cloudshell.dev/login.html'
  };
  user.sendEmailVerification(actionCodeSettings).then(() => {
    window.location = "signupverification.html";
    console.log("Success: email sent to user");  
  }).catch((error) => {
    // An error happened.
    console.log("Error: email not sent to user"); 
  });
}
 
/* Sign a user out of session */
function signOutUser(redirectPage="index.html") {
  // console log statements will be removed in final product
  var user = auth.currentUser;
  var userName = user.displayName;
  var uid = user.uid;
  console.log("userName before logout: " + userName);
  console.log("uid before logout: " + uid);
  clearLocalStorage(["uid", "userName", "isBusinessOwner", 
      "businessName", "userBlobKey", "userEmail"]);
  firebase.auth().signOut().then(() => {
    if (redirectPage != false) {
      window.location= redirectPage;
    }
    console.log("Auth state change success: user logged out");
    user = auth.currentUser;
    if (user == null) {
      console.log("Success: no user found");
    } else {
      console.log("Error: user is not null");
    }
    // Sign-out successful.
  }).catch((error) => {
    console.log("Error in signing out a user");
  });
}

// Unit testing exports set up

module.exports = { 
  setUserType: setUserType,
  setLocalStorageFromSignIn: setLocalStorageFromSignIn,
}