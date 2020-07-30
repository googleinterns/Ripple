/* Contains unit tests for businesscarousels.js file. Includes tests for functions that don't involve Firebase or Google API calls. */

const carouselsModule = require('../webapp/businesscarousels');
const $ = require('jquery');
require('../__mocks__/localstorage');

// Create mock JSON results object. This is what would normally be returned from the geocoding API call.
var results = JSON.parse(
`{
   "results" : [
      {
         "address_components" : [
            {
               "long_name" : "1600",
               "short_name" : "1600",
               "types" : [ "street_number" ]
            },
            {
               "long_name" : "Amphitheatre Pkwy",
               "short_name" : "Amphitheatre Pkwy",
               "types" : [ "route" ]
            },
            {
               "long_name" : "Mountain View",
               "short_name" : "Mountain View",
               "types" : [ "locality", "political" ]
            },
            {
               "long_name" : "Santa Clara County",
               "short_name" : "Santa Clara County",
               "types" : [ "administrative_area_level_2", "political" ]
            },
            {
               "long_name" : "California",
               "short_name" : "CA",
               "types" : [ "administrative_area_level_1", "political" ]
            },
            {
               "long_name" : "United States",
               "short_name" : "US",
               "types" : [ "country", "political" ]
            },
            {
               "long_name" : "94043",
               "short_name" : "94043",
               "types" : [ "postal_code" ]
            }
         ],
         "formatted_address" : "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
         "geometry" : {
            "location" : {
               "lat" : 37.4224764,
               "lng" : -122.0842499
            },
            "location_type" : "ROOFTOP",
            "viewport" : {
               "northeast" : {
                  "lat" : 37.4238253802915,
                  "lng" : -122.0829009197085
               },
               "southwest" : {
                  "lat" : 37.4211274197085,
                  "lng" : -122.0855988802915
               }
            }
         },
         "place_id" : "ChIJ2eUgeAK6j4ARbn5u_wAGqWA",
         "plus_code": {
            "compound_code": "CWC8+W5 Mountain View, California, United States",
            "global_code": "849VCWC8+W5"
         },
         "types" : [ "street_address" ]
      }
   ],
   "status" : "OK"
}`);

/* Test that getAddressComponent correctly parses the JSON object and filters for the city. */
test('getAddressComponent: filters address components', () => {
  expect(carouselsModule.getAddressComponent(results.results[0].address_components, "locality")).toBe("Mountain View");
});

/* Test that viewAll correctly stores the tag in localStorage when the button is clicked. */
test('viewAll: reads and searches carousel tag', () => {
  // Set up window.href
  global.window = Object.create(window);
  const url = "http://localhost/";
  Object.defineProperty(window, 'location', {
      value: {
      href: url,
    }
  });
  window.location.assign = jest.fn();
  carouselsModule.viewAll("Trending");
  expect(localStorage.getItem("galleryPageSearchTag")).toBe("Trending");
  expect(localStorage.getItem("galleryPageName")).toBe("View all");
});