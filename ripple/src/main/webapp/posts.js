/* Update function to fetch all comments for a particular post */
function viewAllPostComments() {
  alert("Fetch all comments for this post!");
}

/* Display an alert if user presses enter to comment on a post */
function addComment(e) {
  comment = document.getElementById("add-comment").value;
  if (e.keyCode === ENTER_KEY) {
    alert("You are commenting: " + comment);
  }
}

/* Saves the caption that the user last typed in the box before clicking an image */
function saveCaption() {
  console.log("saveCaption() called");
  var caption = document.getElementById("modal-caption").value;
  console.log("caption: " + caption);
  localStorage.setItem("caption", caption);
  console.log("local storage caption: " + localStorage.getItem("caption"));
}

/* If the user type is a business owner, display the hidden 'Share your story' button */
function postButtonDisplay() {
  // Check user type
  var isBusinessOwner = localStorage.getItem("isBusinessOwner");
  if (isBusinessOwner == "true") {
    displayElement("post-button");
  }
}

/* If blobKey found in URL, automatically open pop up and display image */
function postsOnload() {
  var blobKey = readBlobKeyFromURl();
  if (blobKey != null) {
    // Open pop up
    clickElement("post-button");
    // Hide upload form
    hideElement("modal-upload-photo");
    // Display photo
    displayElement("modal-display-photo");
    // Serve photo
    serveBlob(blobKey, "modal-display-photo");
    // Display saved caption from local storage
    document.getElementById("modal-caption").value = localStorage.getItem("caption");
    console.log("On post reload local storage caption: " + localStorage.getItem("caption"));
    // Remove disabled attribute from share button
    enableElement("modal-share-button");
  } else {
    // Delete caption local storage
    localStorage.removeItem("caption");
  }
}

/* Add data to Firestore without doc id*/
function newPost() {
  // Remove caption from local storage
  localStorage.removeItem("caption");
  console.log("Remove caption: " + localStorage.getItem("caption"));
  var uid = localStorage.getItem("uid");
  console.log("uid in newPost(): " + uid);
  var blobKey = readBlobKeyFromURl();
  var caption = document.getElementById("modal-caption").value;
  var varArray = [uid, blobKey, caption];
  var whereFieldArray = ["uid"];
  var whereValueArray = [uid];
  // Get city and state from businesses
  var lambda = (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      var city = doc.data().city;
      var state = doc.data().state;
      addPostToFirestore("posts", varArray[0], varArray[1], varArray[2], city, state);
     });
  }
  getOrSnapshotDocsByQuery("get", "businesses", lambda, whereFieldArray, whereValueArray, false, false, varArray);
}

/* Doc id is set by Firestore automatically. Also sets timestamp */
function addPostToFirestore(collection, uid, blobKey, caption, city, state) {
  console.log(collection + " " + uid);
  db.collection("posts").add({
    uid: uid,
    postBlobKey: blobKey,
    caption: caption,
    city: city,
    state: state,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  }).then(() => {
    window.location = "posts.html";
    console.log("Document successfully written!");
  }).catch((error) => {
    console.error("Error writing document: ", error);
  });
}

/* Take user city and state to output posts */
function addDynamicPosts() {
  var postContainerElement = document.getElementById("post-container");
  // For each document in this city, state, in reverse timestamp, create a post element & appendChild to postContainer
  var lambda = (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // Print statements will be deleted in final product
      var uid = doc.data().uid;
      console.log("uid: " + uid);
      // Read fields from post 
      var postBlobKey = doc.data().postBlobKey;
      console.log("postBlobKey: " + postBlobKey);
      var caption = doc.data().caption;
      console.log("caption: " + caption);
      // DELETE FOR FINAL PROD
      var postOrder = doc.data().postOrder;
      console.log("postOrder: " + postOrder);
      var whereFieldArray = ["uid"];
      var whereValueArray = [uid];
      // Get businessName from "businesses" collection using uid. Assume one business per business owner max.
      var secondLambda = (secondQuerySnapshot) => {
        secondQuerySnapshot.forEach((doc) => {
          var businessName = doc.data().businessName[1];
          console.log("businessName: " + businessName);
          // Get userName from "users" collection using uid
          var thirdLambda = (thirdQuerySnapshot) => {
            thirdQuerySnapshot.forEach((doc) => {
              var userName = doc.data().userName;
              console.log("userName: " + userName);
              var userBlobKey = doc.data().userBlobKey;
              console.log("userBlobKey: " + userBlobKey);
              postContainerElement.appendChild(createPostElement(userName, userBlobKey, businessName, postBlobKey, caption));
              document.getElementById("loading-mask").style.display = "none";
            })
          }
          getOrSnapshotDocsByQuery("get", "users", thirdLambda, whereFieldArray, whereValueArray);
         });
      }
      getOrSnapshotDocsByQuery("get", "businesses", secondLambda, whereFieldArray, whereValueArray);
    })
    // Prevent layout shift: display the business details page once a few elements load on the page
  }
  whereFieldArray = ["city", "state"];
  // TEMPORARY LOCAL STORAGE
  localStorage.setItem("city", "New Haven");
  localStorage.setItem("state", "CT");

  var city = localStorage.getItem("city");
  var state = localStorage.getItem("state");
  whereValueArray = [city, state];
  getOrSnapshotDocsByQuery("get", "posts", lambda, whereFieldArray,
    whereValueArray, "timestamp", "desc", varArray=false);
}

// Assumes only one doc exists for a query
function getNameFromFirestoreFuture(collection, uid, lambda) {
  console.log(collection + " " + uid);
  var nameFuture = db.collection(collection)
      .where("uid", "==", uid)
      .get()
      .then(lambda)
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });
}

// Create a post element
function createPostElement(userName, userBlobKey, businessName, postBlobKey, caption) {
  const postElement = document.createElement('div');
  postElement.classList = "post";
  var content = `
      <div class="post-subwrapper space-between">
        <div class="post-header">
          <img id="post-avatar" src="/serve?blob-key=${userBlobKey}" class="post-profile-photo">
          <div class="post-user-business">
            <p class="boldest-text">${userName}</p>
            <p>${businessName}</p>
          </div>
        </div>
        <img class="post-share-icon" src="/images/post_share_icon.png">
      </div>
      <img src="/serve?blob-key=${postBlobKey}" class="post-photo image-resizing">
      <div class="post-line-height"> 
        <div class="post-subwrapper">
          <div class="space-between">
            <p>
              <span class="post-margin-right">
                <img class="heart-icon" src="/images/heart_icon.svg">
              </span>
               482
            </p>
            <p>2 hours ago</p>
          </div>
          <p>
            <span class="boldest-text">${userName}</span>
            ${caption}
          </p>
          <p class="post-view-all" onclick="viewAllPostComments()"> View all 294 comments</p>
          <p>
            <span class="boldest-text">Sarah Wu</span>
            Love this photo!
          </p>
          <p>
            <span class="boldest-text">Smruthi Balajee</span>
            Wow, I'd really love to visit this place sometime!
          </p>
          <hr class="line-break-lighter">
          <textarea class="post-comments" id="add-comment" placeholder="Commenting publicly..."
              onkeypress="addComment(event)"></textarea>
        </div>
      </div>
  `;
  postElement.innerHTML = content;
  return postElement;
}

// Unit testing exports set up

module.exports = { 
  saveCaption: saveCaption,
  createPostElement: createPostElement,
}