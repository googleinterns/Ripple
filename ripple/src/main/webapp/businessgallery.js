/* Function to dynamically load the name of the gallery page. Will either be the user's search input or view all. */
function displayName() {
  console.log(localStorage.getItem('galleryPageName'));
  document.getElementById('left-align-header').innerHTML = localStorage.getItem('galleryPageName');
}