// Serves blob by parsing blobKey from parameter. If no parameter, serves stored blob.
function getBlobKey(uid, blobKey) {
  var newBlobKey = getParameterByName('blob-key');
  console.log("Parameter blobKey: " + newBlobKey);
  
  // New image uploaded. Store blobkey in firestore.
  if (newBlobKey != null) {
    console.log("New image. Blobkey parameter: ", newBlobKey);
    db.collection("users").doc(uid).update({
      blobKey: newBlobKey,
    })
    .then(function() {
    console.log("Document successfully updated!");
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
    serveBlob(newBlobKey, "nav-bar-avatar");
    serveBlob(newBlobKey, "image");
  } else {
    console.log("firestore blobKey: " + blobKey);
    serveBlob(blobKey, "nav-bar-avatar");
    serveBlob(blobKey, "image");
  }
  serveBlob("AMIfv96w0QjM_HH5ABYYypWGVFU2MX_BgxSdVjfUzTVKmH61XU_DN7zV708sadpj3Hc9Drnnd1uci4gEJ0TcYc2LPSvEDX5G7oo3krO4VpaBdslwULQaW4x8DfUzg8jQb9L5DQu9YMkNEcixuNiYdOg94PDWnH8FjONDAxYl2L8GiMEm8MWOZ2zIVi-fSPiX2uBNzYLRG57q8TDONv0ZZYacJkXQ-7QtH_k2lrkGekni7ayxD-wM1HeV-Hn8wvD7EevmbfdDUSkKfWk8gcJx1-muDZNlEgfZWE2yeju3yvlkMJtV-OfbO-4", "camera-icon-id");
}

// Given blob key and image id, inserts image from Blobstore
function serveBlob(blobKey, imageId) {
  const image = document.getElementById(imageId);
  image.src = '/serve?blob-key=' + blobKey;
}

// Read parameter in URL of window
function getParameterByName(name) {
  console.log('called getParameterByName()');
  url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Clicks button to insert file
function selectFile() {
  document.getElementById("file").click();
}

// Reads account name, email, type, and address and adds to DOM.
// Passes blobKey to getBlobKey()
function getAcctInfo(uid) {
  console.log("Success: getAcctInfo() recognizes uid: " + uid);
  var name, email, isBusinessOwner, address, blobKey;
  db.collection("users").where("uid", "==", uid)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        name = doc.data().name;
        addTextToDom(name, "acct-name");
        email = doc.data().email;  
        addTextToDom(email, "acct-email");
        isBusinessOwner = doc.data().isBusinessOwner;  
        if (isBusinessOwner == true) {
          addTextToDom("Business owner", "acct-type");
        } else {
          addTextToDom("Community member", "acct-type");
        }
        address = doc.data().address;  
        addTextToDom(address, "acct-address");
        blobKey = doc.data().blobKey;
        getBlobKey(uid, blobKey);
      });
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    });
}

function addTextToDom(data, id) {
  var element = document.getElementById(id);
  element.innerText = data;
}
