function searchAddress(e){
	addressInput = document.getElementById("address-input").value;
    if (e.keyCode === 13) {
    	alert("You are searching: " + addressInput);
    }
	return false;
}