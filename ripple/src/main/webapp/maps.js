/* Maps JS API initialization */
var mapKey = config.apiKey;
var script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key=" + mapKey + "&callback=initMap&libraries=&v=weekly";
script.defer = true;
script.async = true;
document.head.appendChild(script); 

window.initMap = () => {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    // Import user's current location from local storage
    center: { lat: 34.05, lng: -118.24 },
    disableDefaultUI: true,
    zoomControl: true,
  });
  directionsRenderer.setMap(map);
  calculateAndDisplayRoute(directionsService, directionsRenderer);
}

function calculateAndDgisplayRoute(directionsService, directionsRenderer) {
  directionsService.route(
    {
      origin: {
        query: "Torrance, CA"
      },
      destination: {
        query: "8386 Beverly Blvd"
      },
      travelMode: google.maps.TravelMode.WALKING
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}