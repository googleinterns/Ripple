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