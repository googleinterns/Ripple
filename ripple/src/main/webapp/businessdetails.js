/* When user clicks on a team member, add highlight to that avatar */
$(document).ready(() => {
  $(".bd-avatar").click(function() {
    $(".bd-avatar").removeClass("bd-team-highlight");
    $(this).addClass("bd-team-highlight");
  });
});

$(".selector").on("mouseover", function () {
    //stuff to do on mouseover
});

/* Set user's star rating in local storage upon click of star.
   Change color of the stars accordingly  */
function starRating(starRating) {
  localStorage.setItem("starRating", starRating);
  console.log("starRating() called");
  console.log("starRating local storage: " + localStorage.getItem("starRating"));
  var elementId;
  // Color current and preceding stars orange
  var i;
  for (i = 1; i <= starRating; i++) {
    console.log("i = " + i);
    elementId = "#star-rating-" + i.toString();
    $(elementId).addClass("star-color");
  }
  // Color remaining stars neutral
  var j;
  for (j = starRating + 1; j <= 5; j++) {
    console.log("j = " + j);
    elementId = "#star-rating-" + j.toString();
    $(elementId).removeClass("star-color");
  }
  enableElement("bd-post-review-button");
}

/* Set user's price rating in local storage upon click of dollar sign.
   Change color of the dollar signs accordingly */
function priceRating(priceRating) {
  localStorage.setItem("priceRating", priceRating);
  console.log("priceRating() called");
  console.log("priceRating local storage: " + localStorage.getItem("priceRating"));
  var elementId;
  // Color current and preceding dollar signs as primary
  var i;
  for (i = 1; i <= priceRating; i++) {
    console.log("i = " + i);
    elementId = "#price-" + i.toString();
    $(elementId).addClass("primary-dark-color");
  }
  // Color remaining dollar signs as neutral
  var j;
  for (j = priceRating + 1; j <= 3; j++) {
    console.log("j = " + j);
    elementId = "#price-" + j.toString();
    $(elementId).removeClass("primary-dark-color");
  }
}

/* TODO: Function will add new review to firestore, then refresh the page to see changes */
function newReview() {
  location.reload();
}