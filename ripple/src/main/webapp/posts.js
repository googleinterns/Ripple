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
    // Remove disabled attribute from share button
    enableElement("modal-share-button");
  }
}

// TODO: Reduce Firestore reads by using local storage.
function addDynamicPosts() {
  var postContainerElement = document.getElementById("post-container");
  // For each document in this city, state, in reverse timestamp, create a post element & appendChild to postContainer
  db.collection("posts")
      .where("city", "==", "New Haven")
      .where("state", "==", "CT")
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log("timestamp: " + doc.data().timestamp);
          console.log("postOrder: " + doc.data().postOrder);
          var uid = doc.data().uid;
          console.log("uid: " + uid)
          var caption = doc.data().caption;
          var numberComments = doc.data().numberComments;
          var blobKey = doc.data().blobKey;
          console.log("blobKey: " + blobKey);
          // make sure that the postContainerElement finishes before the promises return
          getNameFromFirestoreFuture('businesses', uid, function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              businessName = doc.data().name;
              console.log("name field for document within businesses: " + businessName);
              getNameFromFirestoreFuture('users', uid, function(secondQuerySnapshot) {
                secondQuerySnapshot.forEach(function(doc) {
                  // doc.data() is never undefined for query doc snapshots
                  userName = doc.data().name;
                  console.log("name field for document within users: " + userName);
                  console.log("userName: " + userName);
                  console.log("businessName: " + businessName);
                  postContainerElement.appendChild(createPostElement(userName, businessName, caption, numberComments, blobKey));
                });
              });
            });

          });
       });
  });
}

// Assumes only one doc exists for a query
function getNameFromFirestoreFuture(collection, uid, lambda) {
  console.log(collection + " " + uid);
  var nameFuture = db.collection(collection)
      .where("uid", "==", uid)
      .get()
      .then(lambda)
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
}

// Create a post element
function createPostElement(userName, businessName, caption, numberComments, blobKey) {
  const postElement = document.createElement('div');
  postElement.classList = "post";
  var content = `
      <div class="post-subwrapper space-between">
        <div class="post-header">
          <img id="post-avatar" src="images/undrawAvatar.svg" class="post-profile-photo">
          <div class="post-user-business">
            <p class="boldest-text">${userName}</p>
            <p>${businessName}</p>
          </div>
        </div>
        <img class="post-share-icon" src="/images/post_share_icon.png">
      </div>
      <img src="/serve?blob-key=${blobKey}" class="post-photo image-resizing">
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
          <p class="post-view-all" onclick="viewAllPostComments()"> View all ${numberComments} comments</p>
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