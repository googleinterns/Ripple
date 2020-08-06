// TEMPORARY LOCAL STORAGE
localStorage.setItem("businessId", "uxq1XtM4zIHqxmdnjnf0");

/* Global variables */
var businessId = localStorage.getItem("businessId");
var isBusinessOwner = localStorage.getItem("isBusinessOwner");
var uid = localStorage.getItem("uid");

/* Add a review: Change color of the elements according to user input onmouseover or onclick 
   If event is onclick, set user choice in local storage.
   If onclick event is for a star rating, enable the button */
function addColorToRating(ratingType, rating, maxRating, elementIdPrefix, addClass, isOnClick=false) {
  if (isOnClick == true) {
    localStorage.setItem(ratingType, rating);
    console.log("addColorToRating local storage: " + localStorage.getItem(ratingType));
    // Enable post button if user has made a star rating
    if (ratingType == "starRating") {
      enableElement("bd-post-review-button");
    }
  }
  var elementId;
  // Color current and preceding elements
  var i;
  for (i = 1; i <= rating; i++) {
    elementId = elementIdPrefix + i.toString();
    $(elementId).addClass(addClass);
  }
  // Reset color of remaining elements to neutral
  var j;
  for (j = rating + 1; j <= maxRating; j++) {
    elementId = elementIdPrefix + j.toString();
    $(elementId).removeClass(addClass);
  }
}

/* Add a review: If no ratings have yet been made, all color will be removed from elements
   Otherwise, ratings will be restored to last clicked value based on local storage */
function removeColorFromRating(ratingType, rating, maxRating, elementIdPrefix, addClass) {
  // Reset all colors to neutral if no ratings have been set
  var currRating = localStorage.getItem(ratingType);
  if (currRating == null) {
    var j;
    for (j = 1; j <= maxRating; j++) {
      elementId = elementIdPrefix + j.toString();
      $(elementId).removeClass(addClass);
    }
  } else {
    addColorToRating(ratingType, parseInt(currRating), maxRating, elementIdPrefix, addClass);
  }
}

/* check if user previously made a review that has not yet been submitted. 
   Output ratings and text, if applicable. If an anonymous user has just signed in, open
   pop up automatically */
function displaySavedRatings() {
  // Check if newly redirected from auth.js. Open pop up by default
  console.log("displaySavedRatings() called");
  var redirectAfterSignIn = localStorage.getItem("redirectAfterSignIn");
  console.log("redirectAfterSignIn", redirectAfterSignIn);
  if (redirectAfterSignIn == "businessdetails.html") {
    clickElement("review-button");
    clearLocalStorage(["redirectAfterSignIn"])
  }
  var starRating = localStorage.getItem("starRating");
  var priceRating = localStorage.getItem("priceRating");
  var reviewText = localStorage.getItem("reviewText");
  if (starRating != null) {
    addColorToRating('starRating', starRating, 5, '#star-rating-', 'star-color', true)
  }
  if (priceRating != null) {
    addColorToRating('priceRating', priceRating, 3, '#price-', 'primary-dark-color', true)
  } 
  if (reviewText != null) {
    setElementValue(reviewText, "bd-review-comment");
  }
}

/* Add a review: Anonymous user that attempts to post is redirect to login, then redirected back. 
   Community member can new review to firestore, then refresh the page to see changes.
   Have already stored starRating (1-5) and priceRating (null, 1, 2, or 3) in local storage. */
function newReview() {
  console.log("newReview()");
  // Check user type
  var isBusinessOwner = localStorage.getItem("isBusinessOwner");
  // Grab text value
  var reviewText = getElementValue("bd-review-comment");
  if (isBusinessOwner == null) { // Anonymous user must sign in first. Will be redirect to same business details page afterward
    // Store review text and redirect in local storage
    localStorage.setItem("reviewText", reviewText);
    localStorage.setItem("redirectAfterSignIn", "businessdetails.html"); 
    window.location = "login.html";
  } else { // Community member
    // Add the community member uid into the a list of users who have reviewed this business
    // Initialize new doc in 'review' collection and store review-specific information
    // Read star rating and price rating
    var starRating = parseInt(localStorage.getItem("starRating"));
    var priceRating = parseInt(localStorage.getItem("priceRating"));
    if (priceRating == null) { // user has not made a price rating, set priceRating as 0.
      priceRating = 0;
    }
    updateUsersReviewedList(uid, starRating, priceRating, reviewText);
    // location.reload();
  }
}

/* Access 'businessDetails' collection and get exisiting list of users who have reviewed this business */
function updateUsersReviewedList(uid, starRating, priceRating, reviewText) {
  console.log("updateUsersReviewedList() called");
  var addUserToReviewsList = (doc) => {
    if (doc.exists) {
      var usersReviewedList = doc.data().usersReviewed;
      // Read summary ratings
      var sumStarRatings = doc.data().sumStarRatings;
      var numStarRatings = doc.data().numStarRatings;
      var sumPriceRatings = doc.data().sumPriceRatings;
      var numPriceRatings = doc.data().numPriceRatings;
      // If user has not reviewed this business, add this user
      console.log("updateUsersReviewedList() reviews summary: ", usersReviewedList, sumStarRatings, numStarRatings, sumPriceRatings, numPriceRatings);
      if (!usersReviewedList.includes(uid)) {
        // Update list and push to Firestore
        usersReviewedList.push(uid);
        console.log("usersReviewedList", usersReviewedList);
        updateDocumentUsingDocId("businessDetails", businessId, {"usersReviewed": usersReviewedList});
        addOrReplaceSummaryRatings(starRating, priceRating, sumStarRatings, numStarRatings, sumPriceRatings, numPriceRatings);
        createReviewDocument(uid, starRating, priceRating, reviewText);
      } else { // If user has already reviewed a business, their review document is automatically overwritten via createReviewDocument
        // Check current user's old price rating / sum rating. Subtract from total. Add new star and price ratings.
        var getOldRatings = (doc) => {
          if (doc.exists) {
            console.log("old rating doc found. replacing summary ratings now");
            // Subtract old price ratings
            var oldStarRating = doc.data().starRating;
            var oldPriceRating = doc.data().priceRating;
            console.log("oldStarRating and starRating: ", oldStarRating, starRating);
            console.log("oldPriceRating and priceRating: ", oldPriceRating, priceRating);
            addOrReplaceSummaryRatings(starRating, priceRating, sumStarRatings, numStarRatings, sumPriceRatings, numPriceRatings, oldStarRating, oldPriceRating);
            createReviewDocument(uid, starRating, priceRating, reviewText, true);
          } else {
            console.log("Error: no doc found");
          }
        }
        getDocByDocId("reviews", uid, getOldRatings);
      }
    } else {
      console.log("Document doesn't exist");
    }
    // createReviewDocument(uid, starRating, priceRating, reviewText);
  }
  getDocByDocId("businessDetails", businessId, addUserToReviewsList);
}

/* Update sumStarRatings, numStarRatings, sumPriceRatings, sumPriceRatings if user adds a new review for the first time or again */
function addOrReplaceSummaryRatings(starRating, priceRating, sumStarRatings, numStarRatings, sumPriceRatings, numPriceRatings, oldStarRating=false, oldPriceRating=false) {
  if (oldStarRating) {
    sumStarRatings -= oldStarRating;
    sumStarRatings += starRating;
  } else {
    sumStarRatings += starRating;
    numStarRatings++;
    console.log("No oldStarRating detected. SumStarRatings now:" + sumStarRatings + "numStarRatings now: " + numStarRatings);
  }
  if (oldPriceRating) { // User may not have made a price rating this time or last time
    if (oldPriceRating == 0 && priceRating == 0) {  // Do nothing
      console.log("No previous or new price rating");
    } else if (oldPriceRating == 0) { // User may not have made a price rating last time but has this time
      sumPriceRatings += priceRating;
      numPriceRatings++;
      console.log("User has never made price rating");
    } else if (priceRating == 0) { // User may not have made a price rating this time but has last time
      sumPriceRatings -= oldPriceRating;
      numPriceRatings--;
      console.log("User has made price rating before, but not this time");
    } else { // Neither old price rating nor price rating are 0
      sumPriceRatings -= oldPriceRating;
      sumPriceRatings += priceRating;
      console.log("User has made price rating before and now: price Rating, oldPriceRating, sumPriceRating, numPriceRating: ", priceRating, oldPriceRating, sumPriceRatings, numPriceRatings);
    }
  } else { // User has never made a price rating
    if (priceRating == 0) {
      console.log("New reviewer, but no price rating specified");
    } else { // User makes price rating for the first time
      sumPriceRatings += priceRating;
      numPriceRatings++;
      console.log("User makes price rating for the first time: ", sumPriceRatings, numPriceRatings);
    }
  }
  var updateMap = {
    "sumStarRatings": sumStarRatings,
    "numStarRatings": numStarRatings,
    "sumPriceRatings": sumPriceRatings,
    "numPriceRatings": numPriceRatings,
  }
  updateDocumentUsingDocId("businessDetails", businessId, updateMap);
}

/* Update sumStarRatings, numStarRatings, sumPriceRatings, sumPriceRatings if user deletes review */
function subtractSummaryRatings(oldStarRating, oldPriceRating, sumStarRatings, numStarRatings, sumPriceRatings, numPriceRatings) {
  console.log("subtractSummaryRatings: ", oldStarRating, oldPriceRating, sumStarRatings, numStarRatings, sumPriceRatings, numPriceRatings);
  sumStarRatings -= oldStarRating;
  numStarRatings--;
  if (oldPriceRating == 0) { // Do nothing
    console.log("oldPriceRating was 0");
  } else {
    sumPriceRatings -= oldPriceRating;
    numPriceRatings--;
  }
  var updateMap = {
    "sumStarRatings": sumStarRatings,
    "numStarRatings": numStarRatings,
    "sumPriceRatings": sumPriceRatings,
    "numPriceRatings": numPriceRatings,
  }
  updateDocumentUsingDocId("businessDetails", businessId, updateMap);
}

/* Create a new document in collection 'reviews' */
function createReviewDocument(uid, starRating, priceRating, reviewText, update=false) {
  var map;
  if (!update) {
    setMap = {
      starRating: starRating,
      priceRating: priceRating,
      reviewText: reviewText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      numLikes: 0,
      usersLiked: [],
      numDislikes: 0,
      usersDisliked: [],
    };
    setNewDocwithDocId("reviews", uid, setMap);
  } else {
    updateMap = {
      "starRating": starRating,
      "priceRating": priceRating,
      "reviewText": reviewText,
      "timestamp": firebase.firestore.FieldValue.serverTimestamp(),
      "numLikes": 0,
      "usersLiked": [],
      "numDislikes": 0,
      "usersDisliked": [],
    };
    updateDocumentUsingDocId("reviews", uid, updateMap);
  }
  // Clear local after accessing these values
  clearLocalStorage(["starRating", "priceRating", "reviewText"]);
}

/* If the user is a business owner, hide 'Add a review' button. Otherwise, display button
   and check if there is any saved ratings info */
function reviewButtonDisplay() {
  // Check user type
  console.log("isBusinessOwner()", isBusinessOwner);
  if (isBusinessOwner == "true") {
    console.log("is a business owner");
    hideElement("review-button");
  } else {
    // Set saved ratings for the pop up and click open if it is a user 
    // returning directly from auth
    displaySavedRatings(); 
  }
}

// Listen for realtime updates in user reviews and display each review
function loadUserReviews() {
  console.log("loadUserReview()");
  var getReviews = (querySnapshot) => {
    // Get outer element
    var userReviewsElement = document.getElementById("user-reviews");
    querySnapshot.forEach((doc) => {
      // Read review data
      var starRating = doc.data().starRating;
      var priceRating = doc.data().priceRating; 
      var reviewText = doc.data().reviewText;
      var numLikes = doc.data().numLikes;
      var numDislikes = doc.data().numDislikes;
      // Convert timestamp to a formatted date
      var timestamp = doc.data().timestamp;
      var date = timestamp.toDate().toDateString();
      var formattedDate = parseDate(date);
      var reviewUserId = doc.id;
      console.log("doc: ",doc.id, reviewUserId, starRating, priceRating, 
          reviewText, formattedDate, numLikes, numDislikes);
      // Use reviewUserId to get the name and blobKey of the user who commented
      var getReviewUserInfo = (doc) => {
        if (doc.exists) {
          var userName = doc.data().userName;
          var userBlobKey = doc.data().userBlobKey;
          // Create review element
          userReviewsElement.appendChild(createReviewElement(doc.id, userName, userBlobKey, starRating, priceRating, 
              reviewText, formattedDate, numLikes, numDislikes));
        } else {
          console.log("Document does not exist");
        }          
      }
      getDocByDocId("users", reviewUserId, getReviewUserInfo);
    })
  }
  getOrSnapshotDocsByQuery("get", "reviews", getReviews, [], [], "timestamp", "desc");
}

/* Create a review element */
function createReviewElement(docId, userName, userBlobKey, starRating, priceRating, 
    reviewText, formattedDate, numLikes, numDislikes) {
      console.log("createReviewElement() called");
      // Returns content containing correctly filled stars
      var starElements = starFillContent(starRating);
      // Returns content containing number of visible and nonvisible $ signs
      var priceElements = priceContent(priceRating);
      var newDiv = document.createElement("div");
      var content = `
        <!-- Single user review -->
        <div id=${docId} class="margin-top-lg">
          <div class="inline-block-child width-100">
            <!-- User information and rating. Delete button -->
            <div class="width-100 opp-elements">
              <p class="inline-block-child">
                <span><img class="inline-block-child-no-padding review-avatar" src="/serve?blob-key=${userBlobKey}"></span>
                <span id="review-user-name" class="boldest-text inline-block-child">${userName}</span>  
                <span id="review-time-stamp margin-left">${formattedDate}</span>
              </p>
              <div class="inline-block-child">
                <div class="inline-block-child star-color">${starElements}</div>
                <div class="inline-block-child">
                  <div class="inline-block-child"><div class="vl"></div></div>
                  <p class="inline-block-child" id="review-price">${priceElements}</p>
                  <i onclick="deleteReview('${docId}')" class="inline-block-child-no-padding cursor-pointer margin-left fas fa-trash-alt fa-lg"></i>
                </div>
              </div>
            </div>
            <!-- ./User information and rating. Delete button -->
          </div>
          <!-- Review text -->
          <div>
            <p class="review-text margin-left-lg">${reviewText}</p>
          </div>
          <!-- ./Revew text -->
          <!-- Like, Like #, Dislike, Dislike # -->
          <div class="margin-left-lg">
            <i id="like-${docId}" onclick="handleLikeOrDislike('${docId}', true)" class="fas fa-thumbs-up margin-right cursor-pointer"></i>
            <p id="num-likes-${docId}" class="inline-block-child">${numLikes}</p>
            <i id="dislike-${docId}" onclick="handleLikeOrDislike('${docId}', false)" class="fas fa-thumbs-down margin-right cursor-pointer"></i>
            <p id="num-dislikes-${docId}" class="inline-block-child">${numDislikes}</p>
          </div>
          <!-- ./Like, Like #, Dislike, Dislike # -->
        </div>
        <!-- ./Single user review -->
      `;
      newDiv.innerHTML = content;
      return newDiv;
}

/* Returns content containing correctly filled stars */
function starFillContent(starRating) {
  var content = "";
  var starIndex;
  for (starIndex = 0; starIndex < starRating; starIndex++) {
    content += `<span class="fa fa-star fa-lg"></span>`;
  }
  while (starIndex < 5) {
    content += `<span class="fa fa-star-o fa-lg"></span>`;
    starIndex += 1;
  }
  return content;
}

/* Returns content containing number of visible and nonvisible $ signs */
function priceContent(priceRating) {
  var content = "";
  var priceIndex;
  for (priceIndex = 0; priceIndex < priceRating; priceIndex++) {
    content += `<span>$</span>`;
  }
  while (priceIndex < 3) {
    content += `<span class="visibility-hidden">$</span>`;
    priceIndex += 1;
  }
  return content;
}

/* Reset stars */
function resetSummaryStars() {
  var i;
  for (var i = 1; i <= 5; i++) {
    elementId = "#star-" + i; 
    $(elementId).removeClass("fa-star");
    $(elementId).addClass("fa-star-o");
    $(elementId).removeClass("star-color");
  }
}

/* When a user deletes their review, remove uid from usersReviewed array in 'business' collection, 
   update summary ratings, and delete their document in the 'reviews' collection */
function deleteReview(userReviewedId) {
  console.log("deleteReview() called ", userReviewedId);
  // Hide review div on front end
  hideElement(userReviewedId);
  addTextToDom("No reviews yet", "review-summary");
  addTextToDom("N/A", "bd-price");
//   $("#bd-price").innerHTML = "N/A";
  resetSummaryStars();
  // Query 'businessDetails' using businessId and get usersReviewed. Remove uid. Update collection
  var removeUserFromUsersReviewed = (doc) => {
    if (doc.exists) {
      // Remove user from usersReviewed list
      usersReviewedList = doc.data().usersReviewed;
      if (usersReviewedList.length > 0) {
        removeArrayElement(uid, usersReviewedList);
        updateDocumentUsingDocId("businessDetails", businessId, {"usersReviewed": usersReviewedList});
        // Read summary ratings
        var sumStarRatings = doc.data().sumStarRatings;
        var numStarRatings = doc.data().numStarRatings;
        var sumPriceRatings = doc.data().sumPriceRatings;
        var numPriceRatings = doc.data().numPriceRatings;
        // Access reviews collection and get old star rating / price rating
        var getOldStarAndPriceRating = () => {
          var oldStarRating = doc.data().oldStarRating;
          var oldPriceRating = doc.data().priceRating;
          // Update summary ratings
          subtractSummaryRatings(oldStarRating, oldPriceRating, sumStarRatings, numStarRatings, sumPriceRatings, numPriceRatings);
        }
        getDocByDocId("reviews", userReviewedId, getOldStarAndPriceRating);
      }
    } else {
      console.log("Document doesn't exist");
    }
  }
  getDocByDocId("businessDetails", userReviewedId, removeUserFromUsersReviewed);
  // Delete doc from 'reviews' using uid (or userReviewedId)
  deleteDocByDocId("reviews", userReviewedId);
}


/* User likes a review. Add checks for if user has already liked review or has disliked previously. */
function handleLikeOrDislike(uid, isLike) {
  console.log("handleLikeOrDislike() is called");
  var handleLikeReq = (doc) => {
    if (doc.exists) {
      var usersLiked = doc.data().usersLiked;
      var usersDisliked = doc.data().usersDisliked;
      var numLikes = doc.data().numLikes;
      var numDislikes = doc.data().numDislikes;
      if (isLike) { // handle like
        // If user has already liked review, remove like from the review
        if (usersLiked.includes(uid)) {
          removeLike(uid, numLikes, usersLiked);
        } else if (usersDisliked.includes(uid)) { // If user has previously disliked review, remove dislike and add like
          removeDislike(uid, numDislikes, usersDisliked);
          like(uid, numLikes, usersLiked);
        } else { // User has never liked or disliked review before, add like
          like(uid, numLikes, usersLiked);
        }
      } else { // handle dislike
        console.log("dislike reached");
        // If user has already disliked review, remove dislike from the review
        if (usersDisliked.includes(uid)) {
          removeDislike(uid, numDislikes, usersDisliked);
        } else if (usersLiked.includes(uid)) { // If user has previously liked review, remove like and add dislike
          removeLike(uid, numLikes, usersLiked);
          dislike(uid, numDislikes, usersDisliked);
        } else { // User has never liked or disliked review before, add like
          dislike(uid, numDislikes, usersDisliked);
        }
      }
    } else {
      console.log("Error: document doesn't exist");
    }
  }
  getDocByDocId("reviews", uid, handleLikeReq);
}

/* Add a like to the review */
function like(uid, numLikes, usersLiked) {
  console.log("like() called");
  // Users newly likes this review.
  // Add highlight to thumbs up
  $("#like-" + uid).addClass("primary-dark-color");
  // Increment number of likes. Add to DOM
  var incrementNumLikes = numLikes + 1;
  addTextToDom(incrementNumLikes.toString(), "num-likes-" + uid);
  // Update numLikes in Firestore. Add uid from usersLiked if not already included
  if (!usersLiked.includes(uid)) {
    usersLiked.push(uid);
    updateDocumentUsingDocId("reviews", uid, {"numLikes": incrementNumLikes, "usersLiked": usersLiked});
  } else {
    updateDocumentUsingDocId("reviews", uid, {"numLikes": incrementNumLikes});
  }
}

/* Remove a like from the review */
function removeLike(uid, numLikes, usersLiked) {
  console.log("removeLike() called");
  // Users removes  likes this review.
  // Add highlight to thumbs up
  $("#like-" + uid).removeClass("primary-dark-color");
  // Increment number of likes. Add to DOM
  var decrementNumLikes = numLikes - 1;
  addTextToDom(decrementNumLikes.toString(), "num-likes-" + uid);
  // Update numLikes in Firestore. Remove uid from usersLiked 
  removeArrayElement(uid, usersLiked);
  updateDocumentUsingDocId("reviews", uid, {"numLikes": decrementNumLikes, "usersLiked": usersLiked});
}

/* Add a dislike to the review */
function dislike(uid, numDislikes, usersDisliked) {
  console.log("usersDisliked: ", usersDisliked);
  console.log("dislike() called");
  // Add highlight to thumbs down
  $("#dislike-" + uid).addClass("primary-dark-color");
  console.log("Class list", document.getElementById("dislike-" + uid).classList.item(0));
  // Increment number of likes. Add to DOM
  var incrementNumDislikes = numDislikes + 1;
  addTextToDom(incrementNumDislikes.toString(), "num-dislikes-" + uid);
  // Update numLikes in Firestore. Add uid from usersLiked 
  if (!usersDisliked.includes(uid)) {
    console.log("usersDisliked does not include this uid: adding new user");
    usersDisliked.push(uid);
    updateDocumentUsingDocId("reviews", uid, {"numDislikes": incrementNumDislikes, "usersDisliked": usersDisliked});
  } else {
    console.log("usersDisliked already include this uid:  new user");
    updateDocumentUsingDocId("reviews", uid, {"numDislikes": incrementNumDislikes});
  }
}

/* Remove a dislike from the review */
function removeDislike(uid, numDislikes, usersDisliked) {
    console.log("removeDislike() called");
  // Add highlight to thumbs down
  $("#dislike-" + uid).removeClass("primary-dark-color");
  // Increment number of likes. Add to DOM
  var decrementNumDislikes = numDislikes - 1;
  addTextToDom(decrementNumDislikes.toString(), "num-dislikes-" + uid);
  // Update numLikes in Firestore. Add uid from usersLiked 
  removeArrayElement(uid, usersDisliked);
  updateDocumentUsingDocId("reviews", uid, {"numDislikes": decrementNumDislikes, "usersDisliked": usersDisliked});
}

/* Load all business details on the body onload */
function bdOnload() {
  // Access 'businessDetails' collection
  var lambda = (doc) => {
        if (doc.exists) {
          // Read and iterate over blobKeys, add the images to carousel.
          var i;
          for (i = 0; i < doc.data().galleryBlobKeys.length; i++) {
            console.log(doc.data().galleryBlobKeys[i]);
            createCarouselElement(doc.data().galleryBlobKeys[i], "imageGallery");
          }

          // Read business phone number and add to DOM 
          phoneNum = doc.data().phoneNum;
          addTextToDom(phoneNum, "bd-phone-number");

          // Read business website href and display string. Add to DOM 
          hrefBusinessWebsite = doc.data().businessWebsite[0];
          addHrefToDom(hrefBusinessWebsite, "business-website");
          displayBusinessWebsite = doc.data().businessWebsite[1];
          addTextToDom(displayBusinessWebsite, "business-website");

          // Prevent layout shift: display the business details page once a few elements load on the page
          document.getElementById("loading-mask").style.display = "none";

          // Read sumStarRatings & numStarRatings
          sumStarRatings = doc.data().sumStarRatings;
          numStarRatings = doc.data().numStarRatings;
          avgStarRatings = sumStarRatings / numStarRatings;
          calculateStars(avgStarRatings, numStarRatings);
          displayStarReviewSummary(avgStarRatings, numStarRatings);

          // Read sumPriceRatings & numPriceRatings
          sumPriceRatings = doc.data().sumPriceRatings;
          numPriceRatings = doc.data().numPriceRatings;
          avgPriceRatings = sumPriceRatings / numPriceRatings;
          calculatePrice(avgPriceRatings, numPriceRatings);

          // Read latestUpdatedTimestamp. Convert to a date. Add to DOM 
          lastUpdatedTimestamp = doc.data().lastUpdatedTimestamp;
          lastUpdatedDate = lastUpdatedTimestamp.toDate().toDateString();
          formattedUpdatedDate = parseDate(lastUpdatedDate);
          addTextToDom(formattedUpdatedDate, "bd-last-update-timestamp");

          // Read latest announcementTimestamp. Convert to a date. Add to DOM 
          announcementTimestamp = doc.data().announcementTimestamp;
          announcementDate = announcementTimestamp.toDate().toDateString();
          formattedAnnouncementDate = parseDate(announcementDate);
          addTextToDom(formattedAnnouncementDate, "bd-announcement-date");

          // Read latest announcements. Add to DOM
          announcementText = doc.data().announcementText;
          addTextToDom(announcementText, "bd-announcement-text");

          // Read business story. Add to DOM 
          businessStory = doc.data().businessStory;
          addTextToDom(businessStory, "bd-story-text");
          
          // Read team blob keys, names, positions and bio. Serve all blob keys to page
          // Display first team member's name, position, and bio. Pass all other team member's
          // information as parameters in an onclick function within their blob key image 
          teamBlobKeyList = doc.data().teamBlobKeyList;
          teamNameList = doc.data().teamNameList;
          teamPositionList = doc.data().teamPositionList;
          teamBioList = doc.data().teamBioList;
          iterateAndDisplayTeamInfo(teamBlobKeyList, teamNameList, teamPositionList, teamBioList);
 
          // Read safety info list. Display corresponding text image / text 
          safetyInfoList = doc.data().safetyInfo;
          displaySafetyInfoImages(safetyInfoList);

          // Read open hours. Iterate through each day and add to DOM. 
          // Update Quick Info section to display "Open" or "Closed" based on current user's time
          openHoursByDay = doc.data().openHours;
          displayAndHighlightOpenHours(openHoursByDay);
          
          // Read delivery links. Add as the href of a service image if link is not empty
          deliveryLinks = doc.data().deliveryLinks;
          iterateAndAddDeliveryLinkHrefs(deliveryLinks);

        } else {
          console.log("Error: business document does not exist");
        }
      }
  getDocByDocId("businessDetails", businessId, lambda);
  
  /* Function to iterate over all the tags for a business and add them to the business details page */
  var queryTags = (doc) => {
        if (doc.exists) {
          var tagsMap = doc.data().tags;
          var tagsList = Object.keys(tagsMap);
          var j;
          for (j = 0; j < tagsList.length; j++) {
            var tag = tagsList[j];
            //console.log(tag);
            createTagElement(tagsMap[tag]);
          }
        }
  }
  getDocByDocId("businesses", businessId, queryTags);
}

/* Function that dynamically creates tag elements */
function createTagElement(tagId) {
  var tagsDiv = document.getElementById('business-tags-header');
  var content = 
  ` <button type="button" class="no-fill-chip bd-subheader-padding-top inline-block-child">${tagId}</button> `;
  tagsDiv.innerHTML = tagsDiv.innerHTML + content + "\n"; 
}

/* Address (Quick Info section): Display street addres */
function iterateAndDisplayAddress(addressArray) {
  // Nothing
}

/* Display review summary: Determine number of full stars, half stars or empty stars to return */
function calculateStars(avgStarRatings, numStarRatings) {
  if (numStarRatings == 0) {
    displayStars(0, 0);
    // 0 for # reviews
  } else if ((1 <= avgStarRatings) && (avgStarRatings < 1.25)) {
    displayStars(1, 0);
  } else if ((1.25 <= avgStarRatings) && (avgStarRatings < 1.75)) {
    displayStars(1, 1);
  } else if ((1.75 <= avgStarRatings) && (avgStarRatings < 2.25)) {
    displayStars(2, 0);
  } else if ((2.25 <= avgStarRatings) && (avgStarRatings < 2.75)) {
    displayStars(2, 1);
  } else if ((2.75 <= avgStarRatings) && (avgStarRatings < 3.25)) {
    displayStars(3, 0);
  } else if ((3.25 <= avgStarRatings) && (avgStarRatings < 3.75)) {
    displayStars(3, 1);
  } else if ((3.75 <= avgStarRatings) && (avgStarRatings < 4.25)) {
    displayStars(4, 0);
  } else if ((4.25 <= avgStarRatings) && (avgStarRatings < 4.75)) {
    displayStars(4, 1);
  } else {
    displayStars(5, 0);
  }
}

/* Display review summary: If no reviews yet, change stars to a neutral color. 
Otherwise, display correct star types (full, half, empty) and colors */
function displayStars(numFullStars, numHalfStars) {
  var numTotalStars = 5;
  var elementId;
  // add the fa-star, fa-star-half-o, or fa-star-o class OR neutral-color for no reviews yet
  if ((numFullStars == 0) && (numHalfStars == 0)) {
    console.log("displayStars(): no reviews yet");
    return;
  }
  // Replace empty star with full star and add color
  var i;
  for (i = 1; i <= numFullStars; i++) {
    elementId = "#star-" + i; 
    $(elementId).removeClass("fa-star-o");
    $(elementId).addClass("fa-star");
    $(elementId).addClass("star-color");
  }
  // Replace empty star with half star and add color
  var j = numFullStars + 1;
  numHalfMax = numFullStars + numHalfStars;
  if (numHalfMax  > numTotalStars) {
    return false;
  }
  for (j; j <= numHalfMax; j++) {
    elementId = "#star-" + j; 
    $(elementId).removeClass("fa");
    $(elementId).removeClass("fa-star-o");
    $(elementId).addClass("fas");
    $(elementId).addClass("fa-star-half-alt");
    $(elementId).attr("aria-hidden","true"),
    $(elementId).addClass("star-color");
  }
  // Add color to remaining stars
  var m = numHalfMax + 1;
  while (m <= numTotalStars) { 
    elementId = "#star-" + m; 
    $(elementId).addClass("star-color");
    m = m + 1;
  }
  console.log("displayStars(" + numFullStars + ", " + numHalfStars + ")");
}

/* Display review summary: Display the average star ratings and number of users who left a review */ 
function displayStarReviewSummary(avgStarRatings, numStarRatings) {
  // If no reviews, keep default text "No reviews yet"
  if (numStarRatings == 0) {
      return;
  } else { // Otherwise, add star review summary to DOM, hide default text, display 
    // Add star review summary to DOM
    addTextToDom(RoundDecimals(avgStarRatings), "bd-average-rating");
    addTextToDom(numStarRatings, "bd-number-reviews");
    // If only 1 star review, change text from plural "reviews" to singular"review"
    if (numStarRatings == 1) {
      addTextToDom("review", "sing-plural-review");
    }
    // Hide default text
    hideElement("no-review-summary");
    // Display populated review summary
    $("#review-summary").removeClass("display-none");
  }
}

/* Display review summary: Given an float, function rounds decimals to the tenths place. Ex: 3.14 -> 3.1 */
function RoundDecimals(float) {
  var roundedFloat = Math.round(float * 10) / 10;
  return roundedFloat;
  console.log("roundedFloat: " + roundedFloat);
}

/* Display review summary: If no reviews yet, default price display is N/A. 
Otherwise, calculate correct price rating $, $$, or $$$ */
function calculatePrice(avgPriceRatings, numPriceRatings) {
  // Default display is N/A if no price reviews have been made
  if (numPriceRatings != 0) {
    if ((1 <= avgPriceRatings) && (avgPriceRatings < 1.5)) {
      displayPrice("$");
    } else if ((1.5 <= avgPriceRatings) && (avgPriceRatings < 2.5)) {
      displayPrice("$$");
    } else { // 2.5 <= avgPriceRatings <= 3
      displayPrice("$$$");
    }
  }
}

/* Display review summary: Display the number of dollar signs for price rating on the page */
function displayPrice(dollarString) {
  addTextToDom(dollarString, "bd-price");
}

/* Our team: Iterate through each teamBlobKey. Create an image element containing their avatar */
function iterateAndDisplayTeamInfo(teamBlobKeyList, teamNameList, teamPositionList, teamBioList) {
  var length = teamBlobKeyList.length;
  var teamMember;
  for (teamMember = 0; teamMember < length; teamMember++) {
    // Add avatar image blob key to the page
    createImageElement(teamMember, teamBlobKeyList[teamMember], teamNameList[teamMember],
       teamPositionList[teamMember], teamBioList[teamMember]);
  }
}

/* Our team: Return an image element with an onclick function passing in team name,
   position, & bio parameters. Generate unique ids to access during onclick event */
function createImageElement(teamMember, teamBlobKey, teamName, teamPosition, teamBio) {
  // Create an img tag with an onclick function storing the team member's name, position, bio
  var formattedTeamName = escapeSpecialCharacters(teamName);
  var formattedTeamPosition = escapeSpecialCharacters(teamPosition);
  var formattedTeamBio = escapeSpecialCharacters(teamBio);
  var content = `
      <img id="bd-team-member-${teamMember}" class="inline-block-child bd-avatar" 
          src="/serve?blob-key=${teamBlobKey}" 
          onclick="highlightAndDisplayTeamMemberInfo(this.id, '${formattedTeamName}', 
          '${formattedTeamPosition}', '${formattedTeamBio}');">
      `;
  // Append img tag to the inner HTML of div containing all blob key image elements
  teamBlobKeysElement = document.getElementById("team-blob-keys");
  teamBlobKeysElement.innerHTML = teamBlobKeysElement.innerHTML + content;
  // After HTML has been loaded, add highlight the first time member
  if (teamMember == 0) {
    firstTeamMemberImageElement = document.getElementById("bd-team-member-0");
    firstTeamMemberImageElement.click();
  }
}

/* Our team: Onclick function unhighlights all team member avatars and highlight the 
   team member of interest. Swap the existing teamName, teamPosition, and teamBio */   
function highlightAndDisplayTeamMemberInfo(clicked_id, formattedTeamName, 
    formattedTeamPosition, formattedTeamBio) {
      console.log("called highlightAndDisplayTeamMemberInfo()");
      $(".bd-avatar").removeClass("bd-team-highlight");
      $("#" + clicked_id).addClass("bd-team-highlight");
      addTextToDom(formattedTeamName, "bd-team-name");
      addTextToDom(formattedTeamPosition, "bd-team-position");
      addTextToDom(formattedTeamBio, "bd-team-bio");
}

/* Safety info: Iterate through safety information and determine whether to display 
   service "offered" or "not offered" visuals for each list element */
function displaySafetyInfoImages(safetyInfoList) {

  // Determine maskBlobKey image and text to serve
  var isMask = safetyInfoList[0];
  var maskBlobKey;
  var maskText;
  var maskTextId = "bd-mask-text";
  if (isMask) { // Set to "offered" color and text 
    maskBlobKey = blob.MASK;
    maskText = "Mask required upon entry";
  } else {
    // Change visual and text to "not offered" color
    maskBlobKey = blob.NO_MASK;
    maskText = "No mask required";
    $("#" + maskTextId).addClass("neutral-lighter-text");
  }

  // Determine deliveryBlobKey image and text to serve
  var isDelivery = safetyInfoList[1];
  var deliveryBlobKey;
  var deliveryText;
  var deliveryTextId = "bd-delivery-text";
  if (isDelivery) { // Set to "offered" color and text 
    deliveryBlobKey = blob.DELIVERY;
    deliveryText =  "Delivery offered";
  } else {
    // Change visual and text to "not offered" color
    deliveryBlobKey = blob.NO_DELIVERY;
    deliveryText =  "No delivery";
    $("#" + deliveryTextId).addClass("neutral-lighter-text");
  }

  // Determine pickupBlobKey image and text to serve
  var isPickup = safetyInfoList[2];
  var pickupBlobKey;
  var pickupText;
  var pickupTextId = "bd-pickup-text";
  if (isPickup) { // Set to "offered" color and text 
    pickupBlobKey = blob.PICKUP;
    pickupText = "Pickup offered";
  } else {
    // Change visual and text to "not offered" color
    pickupBlobKey = blob.NO_PICKUP;
    pickupText = "No pickup";
    $("#" + pickupTextId).addClass("neutral-lighter-text");
  }

  // Determine outdoorBlobKey image and text to serve
  var isOutdoor = safetyInfoList[3];
  var outdoorBlobKey;
  var outdoorText;
  var outdoorTextId = "bd-outdoor-dining-text";
  if (isOutdoor) { // Set to "offered" color and text 
    outdoorBlobKey = blob.OUTDOOR;
    outdoorText = "Outdoor dining offered";
  } else {
    // Change visual and text to "not offered" color
    outdoorBlobKey = blob.NO_OUTDOOR;
    outdoorText = "No outdoor dining";
    $("#" + outdoorTextId).addClass("neutral-lighter-text");
  }

  // Serve all blob keys
  var blobKeyList = [maskBlobKey, deliveryBlobKey, pickupBlobKey, outdoorBlobKey];
  var blobKeyIdList = ["bd-mask-img-id", "bd-delivery-img-id", "bd-pickup-img-id", "bd-outdoor-dining-img-id"];
  var blobNum;
  for (blobNum = 0; blobNum < blobKeyList.length; blobNum++) {
    serveBlob(blobKeyList[blobNum], blobKeyIdList[blobNum]);
  }

  // Add all text to DOM 
  var serviceText = [maskText, deliveryText, pickupText, outdoorText]
  var serviceTextId = [maskTextId, deliveryTextId, pickupTextId, outdoorTextId]
  var textNum;
  for (textNum = 0; textNum < serviceText.length; textNum++) {
    addTextToDom(serviceText[textNum], serviceTextId[textNum]);
  }

  // Display max occupancy details
  var maxOcc = safetyInfoList[4];
  var maxOccId = "bd-max-occ-num";
  if (maxOcc == -1) { // If max occupany is not applicable to business
    // Set the visual and the text in the "not offered" color
    addTextToDom("n/a", maxOccId);
    $("#" + maxOccId).addClass("neutral-lighter-text");
    $("#" + "bd-max-occ-text").addClass("neutral-lighter-text");
  } else { // Otherwise, add max occ value to DOM
    addTextToDom(maxOcc.toString(), maxOccId);
  }
}

/* Open Hours: Iterate through each day of the weeks' open hours and add to DOM. 
   Check current day and highlight that day's hours on the page.
   Add "Open" or "Closed" closed status to Quick Info section */
function displayAndHighlightOpenHours(openHoursByDay) {
  // Initialize a list of ids to get the elements for displaying each day
  var dayIdList = ["bd-sun-hrs", "bd-mon-hrs", "bd-tues-hrs", 
      "bd-wed-hrs", "bd-thur-hrs", "bd-fri-hrs", "bd-sat-hrs"];
  // Display hours for each week and add to DOM
  var dayOfWeek; 
  for (dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    addTextToDom(openHoursByDay[dayOfWeek], dayIdList[dayOfWeek]);
  }
  // Check what current day is. Highlight today's hours in primary dark color
  var today = new Date();
  var currDay = today.getDay();
  $("#" + dayIdList[currDay]).addClass("bd-hrs-highlight");
  $("#" + dayIdList[currDay]).addClass("boldest-text");
  // If current hour and minute are within business open hours range, 
  // display "Open". Otherwise, display "Closed"
  if (openHoursByDay[currDay] == "Closed") {
    addTextToDom(openHoursByDay[currDay], "bd-open-closed");
  } else {
    var openOrClosedStatus = openOrClosed(today, openHoursByDay[currDay]);
    addTextToDom(openOrClosedStatus, "bd-open-closed");
  }
}

/* Open or Closed: Returns "Open" or "Closed" in the Quick Info section depending 
   on whether current hour and minute is within the business open hours range */
function openOrClosed(today, openHoursToday) {
  // Set return values
  var closed = "Closed";
  var open = "Open";
  // Get current hour between 0-23
  currHour = today.getHours();
  console.log("currHour: " + currHour);

  // If business is has no open hours today, display "Closed" in Quick Info section
  if (openHoursToday == closed) {
    addTextToDom(openHoursToday, "bd-open-closed");

  } else { // Otherwise, continue checking if business is currently open
    console.log("openHoursToday: " + openHoursToday + " ");
    var openHoursArray = openHoursToday.split(" ");
    startTime = openHoursArray[0];
    endTime = openHoursArray[2];
    // Get military hour of startTime or endTime given ex: "11:00am"
    var startColonIndex = startTime.indexOf(":");
    var startTimePeriod = startTime.slice(-2);
    var startOpenHour = convertHourToMilitaryTime(startTimePeriod, startTime.substr(0, startColonIndex));
    var endColonIndex = endTime.indexOf(":");
    var endTimePeriod = endTime.slice(-2);
    var endOpenHour = convertHourToMilitaryTime(endTimePeriod, endTime.substr(0, endColonIndex));
    currMinute = today.getMinutes();
    var startOpenMinute = removePrecedingZero(startTime.substr(startColonIndex + 1, 2));
    var endOpenMinute = removePrecedingZero(endTime.substr(startColonIndex + 1, 2));
    // If currHour is equal to startOpenHour and endOpenHour, check if currMinute is 
    // between the minutes of the start open minutes (inclusive) & end open minutes (exclusive)
    if (currHour == startOpenHour && currHour == endOpenHour) {
      if (isWithinRange(parseInt(currMinute), parseInt(startOpenMinute), parseInt(endOpenMinute), true)) {
        return open;
      } else {
        return closed;
      }
    }
    // If currHour is equal to startOpenHour, check if currMinute is equal to or after minute business has opened
    if (currHour == startOpenHour) {
      console.log("currHour == startOpenHour");
      console.log("is startOpenMinute < currMinute: " + startOpenMinute + " < " + currMinute);
      if (parseInt(startOpenMinute) <= parseInt(currMinute)) {
        return open;
      } else {
        return closed;
      }
    }
    // If currHour is equal to endOpenHour, check if currMinute is earlier than the minute the business closes
    if (currHour == endOpenHour) {
      console.log("currHour == endOpenHour");
      console.log("is currMinute < endOpenMinute: " + currMinute + " < " + endOpenMinute);
      if (parseInt(currMinute) < parseInt(endOpenMinute)) {
        return open;
      } else {
        return closed;
      }
    }
    // If currHour is not within startOpenHour (exclusive) and endOpenHour, return "closed" immediately
    if (isWithinRange(parseInt(currHour), parseInt(startOpenHour), parseInt(endOpenHour)) == false) {
      return closed;
    } else { // Check if currMinute is within startOpenMinute and endOpenMinute
      return open;
    }
  }
}

/* Open or Closed: For pm hours, add 12 hours to convert to military time. 
   For am hours, set 12 am to 0 am */
function convertHourToMilitaryTime(timePeriod, hour) {
  if (timePeriod == "am") {
    if (hour == "12") {
      return "0";
    }
    return hour;
  } else { // timePeriod == "pm"
    var intHour = parseInt(hour) + 12;
    return intHour.toString();
  }
}

/* Open or Closed: If minutes contain a preceding 0 (ex: "01" returns "1") 
   Otherwise return minutes. */
function removePrecedingZero(minutes) {
  if (minutes.charAt(0) == "0") {
    return minutes.charAt(1);
  } else {
    return minutes;
  }
}

/* Order delivery: Iterate through each delivery link and add as an href 
   for each delivery type. If the link is an empty string, hide the element */
function iterateAndAddDeliveryLinkHrefs(deliveryLinks) {
  var deliveryLinkIdList = ["uber-eats", "postmates", "grubhub"];
  var maxLen = deliveryLinkIdList.length;
  console.log("delivery link length: " + length);
  var service;
  var link;
  for (service = 0; service < maxLen; service++) {
    link = deliveryLinks[service];
    linkId = deliveryLinkIdList[service];
    if (link) { // Link is provided. Add href.
      addHrefToDom(deliveryLinks[service], linkId);
    } else { // Link is empty str. Hide image of service.
      hideElement(linkId);
    }
  }
}