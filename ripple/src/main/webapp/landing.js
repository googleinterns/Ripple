/* Address input and autocomplete functions. */

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

        //Set the input address to use in the main page
        localStorage.setItem('inputAddress', address);
        window.location.assign("main.html");
    });
}

var ENTER_KEY = 13;
/* Display an alert containing the inputted address if user presses enter */
function searchAddress(keyPress) {
  if (keyPress.keyCode === ENTER_KEY) {
    var address = document.getElementById('address-input').value;
    //Set the input address to use in the main page
    localStorage.setItem('inputAddress', address);
    window.location.assign("main.html");
  }
  return false;
}