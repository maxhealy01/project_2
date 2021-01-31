function showPosition(position) {
	console.log(3);
	console.log(position);
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	alert("Latitude : " + latitude + " Longitude: " + longitude);
}

function errorHandler(err) {
	if (err.code == 1) {
		alert("Error: Access is denied!");
	} else if (err.code == 2) {
		alert("Error: Position is unavailable!");
	}
}

function getLocation() {
	if (navigator.geolocation) {
		console.log(4);
		// timeout at 60000 milliseconds (60 seconds)
		var options = { timeout: 60000 };
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		alert("Sorry, browser does not support geolocation!");
	}
}

getLocation();
