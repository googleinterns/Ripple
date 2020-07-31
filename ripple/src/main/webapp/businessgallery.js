``````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````/* Function to dynamically load the name of the gallery page. Will either be the user's search input or view all. */
function displayName() {
  console.log(localStorage.getItem("galleryPageName"));
  console.log(document.getElementById("left-align-header").value);
  document.getElementById("left-align-header").innerHTML = localStorage.getItem("galleryPageName");
}

/* Function that dynamically loads the businesses into the gallery, depending on the tag that was searched/selected. */
function loadSearchResults() {
    db.collection("businesses").get().then((querySnapshot) => {
        var contentStrings = [];
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

            // Construct card content by appending HTML strings
              var content = `
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100">
                    <img class="card-img-top img-fluid" id="card-dynamic-image" src="/serve?blob-key=${doc.data().thumbnailImage}">
                        <div class="card-body">
                            <p class="card-text">${doc.data().businessName[1]}</p>
                            <p class="card-text"><small class="text-muted">${doc.data().walkingDistance}</small></p>
                        </div>
                    </div>
                </div>
              `;
              //Add every line of reconstructed HTML to contentStrings array
              contentStrings.push(content);
            }
        });
        // Append newly created card element to the container
        if (makeElement) {
          var galleryElement = document.getElementById("row");
          galleryElement.innerHTML = contentStrings.join("\n");
        }
   });
}