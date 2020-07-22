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
  .then(function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(function(result) {
      var user = result.user;
      var uid = user.uid;
      if (authMethod == "signUp") {
        handleSignUpWithGoogle(user, uid);
      } else {
        handleSignInWithGoogle(user, uid);
      }
    }).catch(function(error) {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}

/* If user already made an account, send an alert message.
   Otherwise, authenticate user to Fireabse and send an email verifiation */
function handleSignUpWithGoogle(user, uid) {
  var lambda = function(doc) {
        // If user already has made an account, send an alert
        if (doc.exists) {
            displayElement("signup-method-subtitle")
            // Logging in through Firebase pop up automatically authenticates user
            // for local session. Sign user out because they should not yet exist.
            signOutUser(false);
        } else { // User has not yet made an account
          console.log("Success: Google account linked");
        //   var token = result.credential.accessToken;
          var name = user.displayName;
          var email = user.email;
          var isBusinessOwner = localStorage.getItem("isBusinessOwner");
          console.log("name: " + name);
          console.log("isBusinessOwner: " + isBusinessOwner);
          console.log("uid: " + uid);
          sendEmailVerification(user);
          addNewUser(uid, name, isBusinessOwner, email);
          signOutUser(false);
        }
      }
  getUsersDocByUid(uid, lambda);
}

/* If user already has NOT made an account, send an alert message.
   Otherwise, authenticate user to Fireabse and send an email verifiation */
function handleSignInWithGoogle(user, uid) {
  var lambda = function(doc) {
        if (doc.exists) {
          // Confirm that user has verified their email
          var isEmailVerified = firebase.auth().currentUser.emailVerified;
          console.log("isEmailVerified: " + isEmailVerified);
          if (isEmailVerified == false) {
            // Display alert
            displayElement("verify-login-subtitle");
          } else {
            // Store uid and business type
            var userName = doc.data().name;
            var isBusinessOwner = doc.data().isBusinessOwner;
            setLocalStorageFromSignIn(uid, userName, isBusinessOwner);
            window.location = 'landingbusiness.html';
            console.log("Success: Google account linked");
          }
        } else {
          displayElement("login-subtitle");
          signOutUser(false);
        }
      }
  getUsersDocByUid(uid, lambda);
}

function getUsersDocByUid(uid, lambda) {
  db.collection("users").doc(uid).get()
  .then(lambda)
  .catch(function(error) {
    console.log("Error getting document:", error);
  })
}

function setLocalStorageFromSignIn(uid, userName, isBusinessOwner) {
  localStorage.setItem("uid", uid);
  localStorage.setItem("userName", userName);
  localStorage.setItem("isBusinessOwner", isBusinessOwner);
  console.log("From local storage: " + localStorage.getItem("uid") + ", " + 
      localStorage.getItem("userName") + ", " + localStorage.getItem("isBusinessOwner"));
}

/* Writes user data to firestore */
function addNewUser(uid, name, isBusinessOwner, email) {
  console.log("addNewUser("+ uid + ", " + name + ", " + isBusinessOwner + "," + email + ")");
  db.collection("users").doc(uid).set({
    uid: uid,
    name: name,
    isBusinessOwner: isBusinessOwner,
    email: email,
    blobKey: blob.DEFAULT_AVATAR,
  })
  .then(function(docRef) {
    console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}
 
/* Send user a verification email */
function sendEmailVerification(user) {
  var actionCodeSettings = {
    // URL is specific to Sarah's local dev server. TODO: generalize for deployed website.
    url: 'https://8080-90078eb5-4ff3-4249-9350-838131c19af3.us-west1.cloudshell.dev/login.html'
  };
  user.sendEmailVerification(actionCodeSettings).then(function() {
    window.location = "signupverification.html";
    console.log("Success: email sent to user");  
  }).catch(function(error) {
    // An error happened.
    console.log("Error: email not sent to user"); 
  });
}
 
/* Sign a user out of session */
function signOutUser(redirectPage="index.html") {
  // console log statements will be removed in final product
  var user = auth.currentUser;
  var name = user.displayName;
  var uid = user.uid;
  console.log("name before logout: " + name);
  console.log("uid before logout: " + uid);
  localStorage.removeItem("uid");
  localStorage.removeItem("userName");
  localStorage.removeItem("isBusinessOwner");
  localStorage.removeItem("businessName");
  firebase.auth().signOut().then(function() {
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
  }).catch(function(error) {
    console.log("Error in signing out a user");
  });
}
 
/* Reads account name, email, type, and address and adds to DOM.
Passes blobKey to getBlobKey() */
function getAcctInfo(uid) {
  console.log("Success: getAcctInfo() recognizes uid: " + uid);
  var name, email, isBusinessOwner, address, blobKey;
  db.collection("users")
      .where("uid", "==", uid)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          name = doc.data().name;
          addTextToDom(name, "acct-name", "id");
          email = doc.data().email;  
          addTextToDom(email, "acct-email", "id");
          isBusinessOwner = doc.data().isBusinessOwner;  
          if (isBusinessOwner == true) {
            addTextToDom("Business owner", "acct-type", "id");
          } else {
            addTextToDom("Community member", "acct-type", "id");
          }
          address = doc.data().address;  
          addTextToDom(address, "acct-address", "id");
          blobKey = doc.data().blobKey;
          getBlobKey(uid, blobKey);
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
}
