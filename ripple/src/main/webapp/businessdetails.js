/* When user clicks on a team member, add highlight to that avatar */
$(document).ready(() => {
  $(".bd-avatar").click(function() {
    $(".bd-avatar").removeClass("bd-team-highlight");
    $(this).addClass("bd-team-highlight");
  });
});

/* Change color of the elements according to user input onmouseover or onclick 
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

/* If no ratings have yet been made, all color will be removed from elements
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

/* TODO: Function will add new review to firestore, then refresh the page to see changes */
function newReview() {
  location.reload();
  clearLocalStorage(["starRating", "priceRating"]);
}

/* Load all business details on the body onload */
function bdOnload() {
  // TEMPORARY LOCAL STORAGE UNTIL MANAGE BUSINESS INFO PAGE IS COMPLETE
  localStorage.setItem("walkingTime", 15); 
  localStorage.setItem("walkingDist", 0.7);
  localStorage.setItem("businessId", "uxq1XtM4zIHqxmdnjnf0");
  localStorage.setItem("inputAddress", "398 S Willaman Dr, Los Angeles, CA 90048");
  walkingDist = localStorage.getItem("walkingDist");
  businessId = localStorage.getItem("businessId");
  inputAddress = localStorage.getItem("inputAddress");
  
  // TODO: Access 'businesses' collection to grab businessAddress + render maps + add businessName 
  
  // Add walking time to DOM
  walkingTime = localStorage.getItem("walkingTime");
  addTextToDom(walkingTime, "bd-walking-dist");

  console.log("from local Storage: " + walkingTime + ", " + walkingDist + ", " + businessId + ", " + inputAddress);

  // Access 'businessDetails' collection
  var lambda = (doc) => {
        if (doc.exists) {
          // TODO: Read galleryBlobKeys

          // Read business phone number and add to DOM 
          phoneNum = doc.data().phoneNum;
          addTextToDom(phoneNum, "bd-phone-number");

          // Read business website href and display string. Add to DOM 
          hrefBusinessWebsite = doc.data().businessWebsite[0];
          addHrefToDom(hrefBusinessWebsite, "business-website");
          displayBusinessWebsite = doc.data().businessWebsite[1];
          addTextToDom(displayBusinessWebsite, "business-website");

          // Display the business detials page once a few elements load on the page
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
        } else {
          console.log("Error: business document does not exist");
        }
      }
  getDocByDocId("businessDetails", businessId, lambda)
}

/* Determine number of full stars, half stars or empty stars to return */
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

/* If no reviews yet, change stars to a neutral color. 
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
  if (numHalfMax  > 5) {
    return false;
  }
  for (j; j <= numHalfMax; j++) {
    elementId = "#star-" + j; 
    $(elementId).removeClass("fa-star-o");
    $(elementId).addClass("fa-star-half-o");
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

/* Display the average star ratings and number of users who left a review */ 
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

/* Given an float, function rounds decimals to the tenths place. Ex: 3.14 -> 3.1 */
function RoundDecimals(float) {
  var roundedFloat = Math.round(float * 10) / 10;
  return roundedFloat;
  console.log("roundedFloat: " + roundedFloat);
}

/* If no reviews yet, default price display is N/A. 
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

/* Display the number of dollar signs for price rating on the page */
function displayPrice(dollarString) {
  addTextToDom(dollarString, "bd-price");
}