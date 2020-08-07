/* Manage business page backend. */

/* Maps JS API initialization */
var mapKey = config.apiKey;
var script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key=" + mapKey + "&region=US&libraries=places";
script.defer = true;
script.async = true;
document.head.appendChild(script); 

/* Function that utilizes the Place API to implement an autocomplete feature when a user is entering an address. */
function enterAddressAutocomplete() {
    //TODO: Add to firestore
    var input = document.getElementById('set-address');
    var autocomplete = new google.maps.places.Autocomplete(input);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);

    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();

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
        document.getElementById('set-address').value = address;
    });
}

/* JQuery function to dynamically add open hours elements to the page */
$(document).ready(function(){
//TODO: Add to firestore
  $('.add').click(function(){
    $(".list").append(
    '<div class="mb-2 row justify-content-between px-3">' +
        '<select class="mob mb-2" id="days">' +
            '<option class="options" value="Mon">Mon</option>' +
            '<option class="options" value="Tues">Tues</option>' +
            '<option class="options" value="Wed">Wed</option>' +
            '<option class="options" value="Thurs">Thurs</option>' +
            '<option class="options" value="Fri">Fri</option>' +
            '<option class="options" value="Sat">Sat</option>' +
            '<option class="options" value="Sun">Sun</option>' +
            '</select>' +
        '<div class="mob">' +
            '<label class="text-grey mr-1">From</label>' +
            '<input class="ml-1" id="from" type="time" name="from">' +
            '</div>' +
        '<div class="mob mb-2">' +
            '<label class="text-grey mr-4">To</label>' +
            '<input class="ml-1" id="to" type="time" name="to">' +
            '</div>' +
        '<div class="mt-1 cancel fa fa-times text-danger" id="cancel-button">' +
            '</div>' +
        '</div>');
  });
  $(".list").on('click', '.cancel', function(){
    $(this).parent().remove();
  });
});

// Variables that store color, to check if a user has toggled a tag.
var neutralLightColor = "rgb(186, 186, 186)";
var primaryDarkColor = "rgb(135, 196, 173)";

/* Function that toggles the color of the tag when it is clicked. */
function clickTag(tagId) {
  //TODO: Add to trie and firestore
  console.log(document.getElementById(tagId).style.background);
  if (document.getElementById(tagId).style.background == "" || document.getElementById(tagId).style.background == neutralLightColor) {
    document.getElementById(tagId).style.background = primaryDarkColor;
  } else {
    document.getElementById(tagId).style.background = neutralLightColor;
  }
}

/* Function that adds a user-uploaded image to the carousel. */
function addToCarousel() {
  //TODO: Add to firestore.
  if (localStorage.getItem('galleryCall')) {
    localStorage.setItem('galleryCall', false);
    var blobKey = readBlobKeyFromURl();
    localStorage.setItem('galleryBlobKey', blobKey);
    createCarouselElement(localStorage.getItem('galleryBlobKey'), "imageCarousel");
  } else {
    createCarouselElement(localStorage.getItem('galleryBlobKey'), "imageCarousel");
  }
  
}

/* Function that saves text fields in local storage. */
function saveManageBusinessFields() {
  // Save business details in local Storage
  var businessName = document.getElementById('businessName').value;
  if (businessName != null) {
    localStorage.setItem('businessName', businessName);
  }

  var businessPhone = document.getElementById('businessPhone').value;
  if (businessPhone != null) {
    localStorage.setItem('businessPhone', businessPhone);
  }

  var businessAddress = document.getElementById('set-address').value;
  if (businessAddress != null) {
    localStorage.setItem('businessAddress', businessAddress);
  }
}

/** Function that retrieves all the fields from localStorage on page load. */
function loadManageBusinessFields() {
  // Pull business details from local storage
  var businessName = localStorage.getItem('businessName');
  console.log(localStorage.getItem('businessName'));
  if (businessName != null && businessName != 'undefined') {
    document.getElementById('businessName').value = businessName;
  }

  var businessPhone = localStorage.getItem('businessPhone');
  if (businessPhone != null && businessPhone != 'undefined') {
    document.getElementById('businessPhone').value = localStorage.getItem('businessPhone');
  }

  var businessAddress = localStorage.getItem('businessAddress');
  if (businessAddress != null && businessAddress != 'undefined') {
    document.getElementById('set-address').value = localStorage.getItem('businessAddress');
  }
}

// TODO: Integrate managebusiness with Firestore so that the business will be queried by user id of owner and fields will be populated onload