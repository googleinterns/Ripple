/* Dynamically populates the view all and search result pages. */

/* Maps JS API initialization */
var mapKey = config.apiKey;
var script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key=" + mapKey + "&region=US&libraries=places";
script.defer = true;
script.async = true;
document.head.appendChild(script);

/* Function to dynamically load the name of the gallery page. Will either be the user's search input or view all. */
function displayName() {
  console.log(localStorage.getItem("galleryPageName"));
  console.log(document.getElementById("left-align-header").value);
  document.getElementById("left-align-header").innerHTML = localStorage.getItem("galleryPageName");
}

/* Function that dynamically loads the businesses into the gallery, depending on the tag that was searched/selected. */
function loadSearchResults() {
    db.collection("businesses").get().then((querySnapshot) => {
        var makeElement = false;
        querySnapshot.forEach((doc) => {
            //Check if the city in Firestore matches the city extracted from the user inputted address.
            //Also checks if the business's tag list contains the tag that the carousel requires.
            var tag = localStorage.getItem('galleryPageSearchTag');
            if (doc.data().address != null && doc.data().address[1] == localStorage.getItem('enteredCity') 
                && doc.data().tags[convertToRawString(tag)] !== undefined) {
              makeElement = true;
              const card = document.createElement('div');
              card.classList = 'row';

               // Distance matrix calculations
              // Get user's latitude and longitude from localStorage
              var userLat = localStorage.getItem('enteredLat');
              var userLong = localStorage.getItem('enteredLong');

              // Get business latitude and longitude from GeoPoint object in firestore
              var busLat = doc.data().coordinates.latitude;
              var busLong = doc.data().coordinates.longitude;

              // Reconstruct as maps LatLng object
              var origin = new google.maps.LatLng(userLat, userLong);
              var destination = new google.maps.LatLng(busLat, busLong);
              
              // Call distance matrix service
              var service = new google.maps.DistanceMatrixService();
              service.getDistanceMatrix(
                {
                  origins: [origin],
                  destinations: [destination],
                  travelMode: google.maps.TravelMode.WALKING,
                }, callback);
              
              // In callback function, dynamically construct the HTML for the cards in each carousel
              function callback(response, status) {
                if (status !== "OK") {
                    alert("Error with distance matrix");
                    return;
                }
                // Construct card content by appending HTML strings
                var content = `
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100">
                    <img class="card-img-top img-fluid" id="card-dynamic-image" src="/serve?blob-key=${doc.data().thumbnailImage}"
                                onclick="redirectToBusinessInfo('${doc.id}', '${walkingDist}', '${walkingTime}')"></img>
                        <div class="card-body">
                            <p class="card-text">${doc.data().businessName[1]}</p>
                            <p class="card-text"><small class="text-muted">${response.rows[0].elements[0].duration.text + " walking"}</small></p>
                        </div>
                    </div>
                </div>
               `;

                // Append newly created card element to the container
                if (makeElement) {
                  var galleryElement = document.getElementById("row");
                  galleryElement.innerHTML = galleryElement.innerHTML + content + "\n";
                }
              }
            }
        });
   });
}