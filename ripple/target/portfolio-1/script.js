//import * as geofirestore from 'https://unpkg.com/geofirestore/dist/geofirestore.js';
/* Address input and manipulation functions. */

/* Function that takes the user input and converts it to latitude and longitude coordinates. */
function convertAddressToCoord(address) {
  var geocoder = new google.maps.Geocoder();
  alert(address);
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == 'OK') {
        alert(status);
      localStorage.setItem('enteredLat', results[0].geometry.location.lat());
      localStorage.setItem('enteredLong', results[0].geometry.location.lng());
      alert(typeof localStorage.getItem('enteredLat'));
      alert(typeof localStorage.getItem('enteredLong'));
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
  //convertCoordToCity(geocoder);
}

//TODO: use latitude and longitude to query businesses within a certain radius in future, when Firestore allows for Geopoint queries
/* Given a latitude and longitude, finds the name of the city in the US with those coordinates. */
function convertCoordToCity() {
  var geocoder = new google.maps.Geocoder();
  var latlng = { lat: parseFloat(localStorage.getItem('enteredLat')), lng: parseFloat(localStorage.getItem('enteredLong'))};
  geocoder.geocode({ location: latlng }, function(results, status) {
    if (status === "OK") {
      alert(status);
      if (results[0]) {
        localStorage.setItem('enteredCity', getAddressComponent(results[0].address_components, 'locality'));
        alert(localStorage.getItem('enteredCity'));
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert("Geocoder failed due to: " + status);
    }
  });
}

/* When a list of address components and the type is specified, returns the long name of the type requested. */
function getAddressComponent(components, type) {
  return components.filter((component) => component.types.indexOf(type) === 0).map((item) => item.long_name).pop() || null;
}

function searchAddressAutocomplete() {
    var input = document.getElementById('address-input');
    var autocomplete = new google.maps.places.Autocomplete(input);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);

    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
          searchAddress(event);
        }

        var address = '';
        if (place.address_components) {
        address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
        }
        alert(address);

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

/* Carousel functions. */

/* Carousel function that allows cards to move to the left or right by one. */
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

function geoQuery() {
  //const GeoFirestore = geofirestore.initializeApp(db);
  var GeoFirestore = new GeoFirestore(db);
  // Create a GeoCollection reference
  const geocollection = GeoFirestore.collection('businesses');

  // Add a GeoDocument to a GeoCollection
  geocollection.add({
    name: 'Geofirestore',
    score: 100,
    // The coordinates field must be a GeoPoint!
    coordinates: new db.GeoPoint(40.7589, -73.9851)
  })

  // Create a GeoQuery based on a location
  const query = geocollection.near({ center: new db.GeoPoint(40.7589, -73.9851), radius: 1000 });

  // Get query (as Promise)
  query.get().then((value) => {
    // All GeoDocument returned by GeoQuery, like the GeoDocument added above
    console.log(value.docs);
  });
}

/* Code to dynamically load carousels. */
function loadCarousels() {
    addDynamicCarousel("black-owned-businesses", "Black-owned");
    addDynamicCarousel("under-10-mins-away", "5-10");
    addDynamicCarousel("trending-near-you", "Trending");
    addDynamicCarousel("up-and-coming", "New");
}

function addDynamicCarousel(carouselId, tag) {
    db.collection("businessClusters").get().then((querySnapshot) => {
        var contentStrings = [];
        var makeElement = false;
        querySnapshot.forEach((doc) => {
            if (doc.data().city == localStorage.getItem('enteredCity') && doc.data().tags[tag] == true) {
              makeElement = true;
              const card = document.createElement('div');
              card.classList = 'carousel-inner row w-100 mx-auto';

            // Construct card content
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
              contentStrings.push(content);
            }
        });
        // Append newly created card element to the container
        if (makeElement) {
          var carouselElement = document.getElementById(carouselId);
          var carouselInner = carouselElement.getElementsByClassName('carousel-inner row w-100 mx-auto')[0];
          alert(contentStrings.join("\n"));
          carouselInner.innerHTML = contentStrings.join("\n");
          alert(document.getElementById('card-dynamic-image').src);
          carouselInner.firstElementChild.className += " active";
          $(carouselElement).carousel({slide : true, interval : false});
        }
   });
}



/* Blobstore functions. */

/* creates blobstoreUrl for user profile image to firestore */
function fetchBlobstoreUploadUrl() {
  console.log("called fetchBlobstoreUpload()");
  fetch('/blobstore-upload-url')
      .then((response) => {
        return response.text();
      })
      .then((blobstoreUploadUrl) => {
        const userProfileForm = document.getElementById("user-profile-form");
        userProfileForm.action = blobstoreUploadUrl;
        console.log("fetched blobstoreUploadUrl: " + blobstoreUploadUrl);
        userProfileForm.submit();
      });
}

/* Loads camera icon on Account Settings page */
function loadAcctSettingsIcons() {
  var cameraIconBlob = blob.CAMERA_ICON;
  serveBlob(cameraIconBlob, "camera-icon-id");
}

/* Clicks button to insert file on Account Settings page */
function selectFile() {
  document.getElementById("file").click();
}