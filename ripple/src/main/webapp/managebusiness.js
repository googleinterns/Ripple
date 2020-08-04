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
        '<div class="mt-1 cancel fa fa-times text-danger">' +
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
  var blobKey = readBlobKeyFromURl();
  if (blobKey != null) {
    console.log(blobKey);
    var content = `
        <div class="carousel-item col-md-4">
        <div class="card">
            <img class="card-img-top img-fluid" id="card-dynamic-image" src="/serve?blob-key=${blobKey}"></img>
        </div>
        </div>
    `;
    console.log(content);
    // Append newly created card element to the container
    var carouselElement = document.getElementById(imageCarousel);
    var carouselInner = document.getElementById("firstRow");
    carouselInner.innerHTML = carouselInner.innerHTML + content + "\n";  
    // Only want to append the string active once
    if (!carouselInner.firstElementChild.className.includes("active")) {
        carouselInner.firstElementChild.className += " active";
    }
    $(carouselElement).carousel({slide : true, interval : false});
    }
}