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
  console.log("removeColorsFromRating() called");
  var currRating = localStorage.getItem(ratingType);
  console.log("currRating: " + currRating);
  if (currRating == null) {
    var j;
    for (j = 1; j <= maxRating; j++) {
      console.log("j = " + j);
      elementId = elementIdPrefix + j.toString();
      $(elementId).removeClass(addClass);
    }
  } else {
    console.log(ratingType, currRating, maxRating, elementIdPrefix, addClass);
    addColorToRating(ratingType, parseInt(currRating), maxRating, elementIdPrefix, addClass);
  }
}

/* TODO: Function will add new review to firestore, then refresh the page to see changes */
function newReview() {
  location.reload();
}