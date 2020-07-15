// Read parameter by name of 
function getParameterByName(name) {
  console.log('blob-key');
  url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Grab blob-key parameter for accountsettings.html
function getBlobKey() {
  var blobKey = getParameterByName('blob-key');
  console.log('blob-key');
}