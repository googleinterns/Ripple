/* Maps JS API initialization */
var mapKey = config.apiKey;
var script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key=" + mapKey + "&callback=initMap&libraries=&v=weekly";
script.defer = true;
script.async = true;
document.head.appendChild(script); 

/* Render a world map centered at the US. Read user address and business address
 from local Storage and Firestore, respectively. Read business name and street from 
 Firestore and add to DOM */
window.initMap = () => {

  // TEMPORARY LOCAL STORAGE 
  localStorage.setItem("businessId", "uxq1XtM4zIHqxmdnjnf0");
  localStorage.setItem("inputAddress", "398 S Willaman Dr, Los Angeles, CA 90048");
  localStorage.setItem("walkingTime", 15); 
  localStorage.setItem("walkingDist", 0.7);

  // Read local storage values
  businessId = localStorage.getItem("businessId");
  inputAddress = localStorage.getItem("inputAddress");
  walkingTime = localStorage.getItem("walkingTime");
  walkingDist = localStorage.getItem("walkingDist");

  // Add walking time to DOM
  addTextToDom(walkingTime, "bd-walking-dist");

  // Access 'businesses' collection to read the business name and address 
  var lambda = (doc) => {
        if (doc.exists) {
          // Read business name and add to DOM 
          businessName = doc.data().businessName[1];
          addTextToDom(businessName, "bd-header");

          // Read business address and add street to DOM. 
          addressArray = doc.data().address;
          addTextToDom(addressArray[0], "bd-address");
          // Join each array element of the addressArray into a string. Set as the map destination.
          destination = addressArray.join(" ");
          console.log("destination address:" + destination);

          // Specify map display and initialize directions service
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer();
          var centerOfUnitedStates = new google.maps.LatLng(39.8283, -98.5795);
          const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 3,
            center: centerOfUnitedStates,
            // Only display zoom settings from UI controls
            disableDefaultUI: true,
            zoomControl: true,
          });
          directionsRenderer.setMap(map);
          calculateAndDisplayRoute(map, directionsService, directionsRenderer, destination);

        } else {
          console.log("Error: business document does not exist");
        }
      }
  getDocByDocId("businesses", businessId, lambda);
}

/* Calculate and display walking directions from origin to destination. Add an info window 
   displaying walking time distance in the center of the travel path */
function calculateAndDisplayRoute(map, directionsService, directionsRenderer, destination) {
  directionsService.route(
    {
      origin: {
        query: inputAddress
      },
      destination: {
        query: destination
      },
      travelMode: google.maps.TravelMode.WALKING
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        var center_point = response.routes[0].overview_path.length/2;
        console.log("center_point: " + center_point);
        // Display an info window at the calculated center of the walking route
        var infowindow = new google.maps.InfoWindow();
        // Add a walking icon and display walking time and distance 
        content = `
          <div>
            <i class="inline-block-child-no-padding fas fa-walking"></i>
            <p class="inline-block-child-no-padding boldest-text padding-left">${walkingTime} min</p>
          </div>
          <p>${walkingDist} miles</p>
        `;
        infowindow.setContent(content);
        infowindow.setPosition(response.routes[0].overview_path[center_point|0]);
        infowindow.open(map);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
} 