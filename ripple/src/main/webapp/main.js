/* Dynamic Carousel functions. */

/* Carousel function that allows cards to move to the left or right by one. Establishes functionality of the carousel. */
  $("#card-carousel1").on("slide.bs.carousel", function(e) {
    var $e = $(e.relatedTarget);
    var idx = $e.index();
    var itemsPerSlide = 3;
    var totalItems = $(".carousel-item").length;
    var percent = (idx / totalItems) * 100;
    $('.progress-bar').css({width: percent + '%'});
    if (idx >= totalItems - (itemsPerSlide - 1)) {
      var it = itemsPerSlide - (totalItems - idx);
      for (var i = 0; i < it; i++) {
        // append slides to end
        if (e.direction == "left") {
          $(".carousel-item")
            .eq(i)
            .appendTo(".carousel-inner");
        } else {
          $(".carousel-item")
            .eq(0)
            .appendTo($(this).find(".carousel-inner"));
        }
      }
    }
  });

/* Code to dynamically load carousels. Calls addDynamicCarousel function to populate the carousels. */
function loadCarousels() {
    addDynamicCarousel("black-owned-businesses", "Black-owned");
    addDynamicCarousel("under-10-mins-away", "5-10");
    addDynamicCarousel("trending-near-you", "Trending");
    addDynamicCarousel("up-and-coming", "New");
}

/* Dynamically loads content into Bootstrap carousel by reconstructing HTML elements and making a Firestore query. */
function addDynamicCarousel(carouselId, tag) {
    db.collection("businessClusters").get().then((querySnapshot) => {
        var contentStrings = [];
        var makeElement = false;
        querySnapshot.forEach((doc) => {
            //Check if the city in Firestore matches the city extracted from the user inputted address.
            //Also checks if the business's tag list contains the tag that the carousel requires.
            if (doc.data().city == localStorage.getItem('enteredCity') && doc.data().tags[tag] == true) {
              makeElement = true;
              const card = document.createElement('div');
              card.classList = 'carousel-inner row w-100 mx-auto';

            // Construct card content by appending HTML strings
              var content = `
                <div class="carousel-item col-md-4">
                <div class="card">
                    <img class="card-img-top img-fluid" id="card-dynamic-image" src="/serve?blob-key=${doc.data().thumbnailImage}">
                    <div class="card-body">
                    <p class="card-text">${doc.data().name}</p>
                    <p class="card-text"><small class="text-muted">${doc.data().walkingDistance}</small></p>
                    </div>
                </div>
                </div>
              `;
              //Add every line of reconstructed HTML to contentStrings array
              contentStrings.push(content);
            }
        });
        // Append newly created card element to the container
        if (makeElement) {
          var carouselElement = document.getElementById(carouselId);
          var carouselInner = carouselElement.getElementsByClassName('carousel-inner row w-100 mx-auto')[0];
          carouselInner.innerHTML = contentStrings.join("\n");
          carouselInner.firstElementChild.className += " active";
          $(carouselElement).carousel({slide : true, interval : false});
        }
   });
}