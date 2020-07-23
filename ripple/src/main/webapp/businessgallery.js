/* Function to dynamically load the name of the gallery page. Will either be the user's search input or view all. */
function displayName() {
  console.log(localStorage.getItem("galleryPageName"));
  console.log(document.getElementById("left-align-header").value);
  document.getElementById("left-align-header").innerHTML = localStorage.getItem("galleryPageName");
}