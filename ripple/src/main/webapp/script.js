/* Address input and manipulation functions. */

/* Function that takes the user inputted address and converts it to latitude and longitude coordinates. */
function convertAddressToCoord(address) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {
      //Stores user's latitude and longitude in localStorage, to be used for computing walking distance
      localStorage.setItem('enteredLat', results[0].geometry.location.lat());
      localStorage.setItem('enteredLong', results[0].geometry.location.lng());
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

//TODO: use latitude and longitude to query businesses within a certain radius in future, when Firestore allows for Geopoint queries
/* Given a latitude and longitude, finds the name of the city in the US with those coordinates. */
function convertCoordToCity() {
  var geocoder = new google.maps.Geocoder();
  var latlng = { lat: parseFloat(localStorage.getItem('enteredLat')), lng: parseFloat(localStorage.getItem('enteredLong'))};
  geocoder.geocode({ location: latlng }, function(results, status) {
    if (status === "OK") {
      if (results[0]) {
        //Stores user's city in localStorage, to be used in the main page query
        localStorage.setItem('enteredCity', getAddressComponent(results[0].address_components, 'locality'));
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

/* Function that utilizes the Place API to implement an autocomplete feature when a user is entering an address. */
function searchAddressAutocomplete() {
    var input = document.getElementById('address-input');
    var autocomplete = new google.maps.places.Autocomplete(input);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);

    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and pressed the Enter key, or the Place Details request failed.
          //Use searchAddress function instead to handle queries not made through the autocomplete feature.
          searchAddress(event);
        }

        //Reconstruct address from the place API components
        var address = '';
        if (place.address_components) {
        address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
        }

        //Convert address if user clicks on the autocomplete suggestion
        convertAddressToCoord(address);
        convertCoordToCity();
        window.location.assign("main.html");
    });
}

/* Display an alert containing the inputted address if user presses enter */
function searchAddress(e) {
  if (e.keyCode === 13) {
    var address = document.getElementById('address-input').value;
    convertAddressToCoord(address);
    convertCoordToCity();
    window.location.assign("main.html");
  }
  return false;
}

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
                    <img class="card-img-top img-fluid" id="card-dynamic-image" src = "/serve?blob-key=${doc.data().thumbnailImage}">
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

/* Blobstore and post functions. */

/* Display an alert if user presses enter to comment on a post */
function addComment(e) {
  comment = document.getElementById("add-comment").value;
  if (e.keyCode === 13) {
    alert("You are commenting: " + comment);
  }
}

/* creates blobstoreUrl for image to firestore */
function fetchBlobstoreUploadUrl(formId, fileId, webUrl) {
  fetch('/blobstore-upload-url?file-id=' + fileId + '&web-url=' + webUrl)
      .then((response) => {
        return response.text();
      })
      .then((blobstoreUploadUrl) => {
        const form = document.getElementById(formId);
        form.action = blobstoreUploadUrl;
        console.log("fetched blobstoreUploadUrl: " + blobstoreUploadUrl);
        form.submit();
      });
}

/* Loads camera icon on Account Settings page */
function loadAcctSettingsIcons() {
  var cameraIconBlob = blob.CAMERA_ICON;
  serveBlob(cameraIconBlob, "camera-icon-id");
}

/* Clicks button to insert file on Account Settings page */
function selectFile(fileId) {
  document.getElementById(fileId).click();
}

function viewAllPostComments() {
  alert("Fetch all comments for this post!");
}