/* Hardcode businesses to datastore: only called once, when setting up new database. */

/*Write a singular business to the datastore. */
function writeBusiness(businessName, tags, walkingDistance, address, thumbnailImage, latitude, longitude) {
  // Add a new document in collection "cities"
  alert("writing business");
  db.collection("businesses").doc().set({
    businessName: businessName,
    tags: tags,
    walkingDistance: walkingDistance,
    address: address,
    thumbnailImage: thumbnailImage,
    coordinates: new firebase.firestore.GeoPoint(latitude, longitude)
  })
  .then(function() {
    console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
  });
}

/* Function that calls writeBusiness() to hardcode a business to Firestore. */
function hardcodeBusinesses() {

  //Berkeley
  var cupcakinname = ["CUPCAKINBAKESHOP" , "Cupcakin' Bake Shop"];
  var cupcakinmap = {"CUPCAKINBAKESHOP" : "Cupcakin' Bake Shop", "BAKERY" : "Bakery", "TRENDING" : "Trending", "NEW" : "New"};
  var cupcakinaddress = ["2391 Telegraph Ave", "Berkeley", "CA"];
  writeBusiness(cupcakinname, cupcakinmap, "15-20 mins walking", cupcakinaddress, "kXvC6NcTJbKnYrTjKqKBSw", 37.86708, -122.25878);

  var viksname = ["VIKSCHAAT", "Vik's Chaat"];
  var viksmap = {"VIKSCHAAT" : "Vik's Chaat", "INDIAN" : "Indian", "TRENDING" : "Trending", "CLOSE" : "Close"};
  var viksaddress = ["2390 Fourth St", "Berkeley", "CA"];
  writeBusiness(viksname, viksmap, "5-10 mins walking", viksaddress, "kuJGd77ktQMNWR0cDzVN2g", 37.861382, -122.298424);

  var angelinesname = ["ANGELINESLOUISIANAKITCHEN" , "Angeline's Louisiana Kitchen"];
  var angelinesmap = {"ANGELINESLOUISIANAKITCHEN" : "Angeline's Louisiana Kitchen", "SOULFOOD" : "Soul-food", "BLACKOWNED" : "Black-owned", "NEW" : "New"};
  var angelinesaddress = ["2261 Shattuck Ave", "Berkeley", "CA"];
  writeBusiness(angelinesname, angelinesmap, "15-20 mins walking", angelinesaddress, "Sk059OWsG3aheK8AO5x76g", 37.868220, -122.267550);

  var greatname = ["GREAT CHINA" , "Great China"];
  var greatmap = {"GREATCHINA" : "Great China", "CHINESE" : "Chinese", "TRENDING" : "Trending", "NEW" : "New"};
  var greataddress = ["2190 Bancroft Way", "Berkeley", "CA"];
  writeBusiness(greatname, greatmap, "10-15 mins walking", greataddress, "k8SLL3dYwrZ9mu67Gsmdlg", 37.867550, -122.266240);

  var pinkyname = ["PINKYANDREDS" , "Pinky and Red's"];
  var pinkymap = {"PINKYANDREDS" : "Pinky and Red's", "SOULFOOD" : "Soul-food", "BLACKOWNED" : "Black-owned", "CLOSE" : "Close"};
  var pinkyaddress = ["2495 Bancroft Way", "Berkeley", "CA"];
  writeBusiness(pinkyname, pinkymap, "5-10 mins walking", pinkyaddress, "AX3Y4ASch6cJplrjuOwHwA", 37.868730, -122.259410);

  var immname = ["IMMTHAISTREETFOOD" , "Imm Thai Street Food"];
  var immmap = {"IMMTHAISTREETFOOD" : "Imm Thai Street Food", "THAI" : "Thai", "TRENDING" : "Trending", "NEW" : "New"};
  var immaddress = ["2068 University Ave", "Berkeley", "CA"];
  writeBusiness(immname, immmap, "15-20 mins walking", immaddress, "iPXAzVxHyo57O8zz1PQvpQ", 37.871880, -122.269790);

  var tossname = ["TOSSNOODLEBAR" , "Toss Noodle Bar"];
  var tossmap = {"TOSSNOODLEBAR" : "Toss Noodle Bar", "ASIAN" : "Asian", "TRENDING" : "Trending", "CLOSE" : "Close"};
  var tossaddress = ["2272 Shattuck Ave", "Berkeley", "CA"];
  writeBusiness(tossname, tossmap, "5-10 mins walking", tossaddress, "Mn7Nc-q8KaWPWsR_wyaCDw", 37.867750, -122.267930);

}