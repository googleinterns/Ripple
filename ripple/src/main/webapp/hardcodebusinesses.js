/* Hardcode businesses to datastore: only called once, when setting up new database. */

/*Write a singular business to the datastore. */
function writeBusiness(name, tags, walkingDistance, streetAddress, city, state, thumbnailImage) {
  // Add a new document in collection "cities"
  alert("writing business");
  db.collection("businesses").doc().set({
    name: name,
    thumbnailImage: thumbnailImage,
    streetAddress: streetAddress,
    city: city,
    state: state,
    tags: tags,
    walkingDistance: walkingDistance
  })
  .then(function() {
    console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
  });
}

/* Function that calls writeBusiness() to hardcode a business to Firestore. */
function hardcodeBusiness() {
  //TODO: for carousel, allow maximum of 10 slides; for tags, allow maximum of 10
  var cupcakinMap = {"Cupcakin' Bake Shop" : true, "Cupcakin'" : true, "Bake" : true, "Shop" : true, "Bakery" : true, "Trending" : true, "New" : true}
  writeBusiness("Cupcakin' Bake Shop", cupcakinMap, "15-20 mins", "2391 Telegraph Ave", "Berkeley", "CA", "SvcfhPVWvvoXJZjvKUjX4Q");
}