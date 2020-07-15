
/* Carousel function that allows cards to move to the left or right by one. */
  $("#card-carousel1").on("slide.bs.carousel", function(e) {
    var $e = $(e.relatedTarget);
    var idx = $e.index();
    var itemsPerSlide = 3;
    var totalItems = $(".carousel-item").length;
    var percent = (idx / totalItems) * 100;
    $('.progress-bar').css({width: percent + '%'});
    if (idx >= totalItems - (itemsPerSlide - 1)) {
      var it = itemsPerSlide - (totalItems - idx);
      for (var i = 0; i < it; i++) {
        // append slides to end
        if (e.direction == "left") {
          $(".carousel-item")
            .eq(i)
            .appendTo(".carousel-inner");
        } else {
          $(".carousel-item")
            .eq(0)
            .appendTo($(this).find(".carousel-inner"));
        }
      }
    }
  });


/* Display an alert containing the inputted address if user presses enter. */
function searchAddress(e){
  addressInput = document.getElementById("address-input").value;
  if (e.keyCode === 13) {
    alert("You are searching: " + addressInput);
  }
  window.location.assign("main.html");
  return false;
}

/* Query a singular business from the datastore. */
function queryBusiness() {
   db.collection("businessClusters").get().then((querySnapshot) => {
       querySnapshot.forEach((doc) => {
           console.log(doc.data().name);
       });
   });
}

/*Write a singular business to the datastore. */
function writeBusiness() {
  // Add a new document in collection "cities"
  db.collection("businessClusters").doc("cupcakinBake").set({
    name: "Cupcakin' Bake Shop",
  })
  .then(function() {
    console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
  });
}

function loadCarousels() {
    addDynamicCarousel("black-owned-businesses");
    addDynamicCarousel("under-10-mins-away");
    addDynamicCarousel("trending-near-you");
    addDynamicCarousel("up-and-coming");
}

function addDynamicCarousel(carouselId) {
    db.collection("businessClusters").get().then((querySnapshot) => {
        var contentStrings = [];
        querySnapshot.forEach((doc) => {
            const card = document.createElement('div');
            card.classList = 'carousel-inner row w-100 mx-auto';

            // Construct card content
            var content = `
                <div class="carousel-item col-md-4">
                <div class="card">
                    <img class="card-img-top img-fluid" src="images/chinese_food.jpg" alt="Card image cap">
                    <div class="card-body">
                    <p class="card-text">${doc.data().name}</p>
                    <p class="card-text"><small class="text-muted">5-10 min walking</small></p>
                    </div>
                </div>
                </div>
            `;
                
            contentStrings.push(content);
        });

        // Append newly created card element to the container
        var carouselElement = document.getElementById(carouselId);
        var carouselInner = carouselElement.getElementsByClassName('carousel-inner row w-100 mx-auto')[0];
        carouselInner.innerHTML = contentStrings.join("\n");
        carouselInner.firstElementChild.className += " active";
        $(carouselElement).carousel({slide : true, interval : false});
   });
}

function setBusinessEditFields() {
  const snapshot = db.collection('businessClusters').doc('cupcakinBake').get().then(doc => {
    if (doc.exists) {
      document.getElementById("name").value = doc.data().name;
    } else {
      console.log("No such document!");
    }
    }).catch(function(error) {
     console.log("Error getting document:", error);
    });
}

function writeBusinessEditFields() {
  var content = document.getElementById("name").value;
  db.collection("businessClusters").doc("cupcakinBake").set({
    name: content,
  })
}