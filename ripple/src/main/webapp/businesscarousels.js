/* Dynamic Carousel functions. */

/* Function that takes the user inputted address and converts it to latitude and longitude coordinates. */
function convertAddressToCoord() {
  var address = localStorage.getItem('inputAddress');
  var geocoder = new google.maps.Geocoder();
  console.log("old" + localStorage.getItem('enteredLat') + localStorage.getItem('enteredLong'));
  geocoder.geocode( { 'address': address}, (results, status) => {
    if (status == 'OK') {
      //Stores user's latitude and longitude in localStorage, to be used for computing walking distance
      localStorage.setItem('enteredLat', results[0].geometry.location.lat());
      localStorage.setItem('enteredLong', results[0].geometry.location.lng());
      console.log(localStorage.getItem('enteredLat'));
      console.log(localStorage.getItem('enteredLong'));
      convertCoordToCity();
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

//TODO: use latitude and longitude to query businesses within a certain radius in future, when Firestore allows for Geopoint queries
/* Given a latitude and longitude, finds the name of the city in the US with those coordinates. */
function convertCoordToCity() {
  var geocoder = new google.maps.Geocoder();
  console.log(localStorage.getItem('enteredLat')+ ' in coordToCity');
  console.log(localStorage.getItem('enteredLong') + ' in coordToCity');
  var latlng = { lat: parseFloat(localStorage.getItem("enteredLat")), lng: parseFloat(localStorage.getItem("enteredLong"))};
  geocoder.geocode({ location: latlng }, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        //Stores user's city in localStorage, to be used in the main page query
        localStorage.setItem("enteredCity", getAddressComponent(results[0].address_components, "locality"));
        console.log('enteredCity ' + localStorage.getItem('enteredCity'));
        loadCarousels();
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert("Geocoder failed due to: " + status);
    }
  });
}

/* When a list of address components and the type is specified, returns the long name of the type requested. Uses map and filter to parse
   the address_components arrays. */
function getAddressComponent(components, type) {
  return components.filter((component) => component.types.indexOf(type) === 0).map((item) => item.long_name).pop() || null;
}

/* Carousel function that allows cards to move to the left or right by one. Establishes functionality of the carousel. */
function cardFunctionality() {
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
}

/* Code to dynamically load carousels. Calls addDynamicCarousel function to populate the carousels. */
function loadCarousels() {
    addDynamicCarousel("black-owned-businesses", "Black-owned");
    addDynamicCarousel("under-10-mins-away", "Close");
    addDynamicCarousel("trending-near-you", "Trending");
    addDynamicCarousel("up-and-coming", "New");
}

/* Dynamically loads content into Bootstrap carousel by reconstructing HTML elements and making a Firestore query. */
function addDynamicCarousel(carouselId, tag) {
    db.collection("businesses").get().then((querySnapshot) => {
        var contentStrings = [];
        var makeElement = false;
        querySnapshot.forEach((doc) => {
            //Check if the city in Firestore matches the city extracted from the user inputted address.
            //Also checks if the business's tag list contains the tag that the carousel requires.
            if (doc.data().address != null && doc.data().address[1] == localStorage.getItem('enteredCity') 
                && doc.data().tags[convertToRawString(tag)] == tag) {
              makeElement = true;
              const card = document.createElement('div');
              card.classList = 'carousel-inner row w-100 mx-auto';

            // Construct card content by appending HTML strings
              var content = `
                <div class="carousel-item col-md-4">
                <div class="card">
                    <img class="card-img-top img-fluid" id="card-dynamic-image" src="/serve?blob-key=${doc.data().thumbnailImage}">
                    <div class="card-body">
                    <p class="card-text">${doc.data().businessName[1]}</p>
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

/* When view all is clicked, redirects to the gallery page and sets the name to be view all. 
   Sets the search tag for the gallery page to the corresponding carousel id tag. */
function viewAll(tag) {
  localStorage.setItem("galleryPageName", "View all");
  localStorage.setItem("galleryPageSearchTag", tag);
  window.location.assign("businessgallery.html");
}

module.exports = { 
  viewAll: viewAll,
  getAddressComponent: getAddressComponent,
}