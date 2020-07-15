/*Write a singular business to the datastore. */
function writeBusiness(name, thumbnailImage, tags, walkingDistance) {
  // Add a new document in collection "cities"
  db.collection("businessClusters").doc().set({
    name: name,
    thumbnailImage: thumbnailImage,
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

//for carousel, allow maximum of 10 slides
//for tags, allow maximum of 10