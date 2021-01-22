if (!markers) {
	let markers = [];
}

let getLocation = () => {
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				let latitude = position.coords.latitude;
				let longitude = position.coords.longitude;
				return latitude, longitude;
			},
			(error) => {
				console.log(error.code);
			}
		);
	} else {
		console.log("Not Supported");
	}
};

function initMap() {
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				let latitude = position.coords.latitude;
				let longitude = position.coords.longitude;
				console.log(latitude, longitude);
				var options = {
					center: { lat: latitude, lng: longitude },
					zoom: 14,
				};

				map = new google.maps.Map(document.getElementById("map"), options);

				let marker = new google.maps.Marker({
					position: { lat: latitude, lng: longitude },
					map: map,
				});

				markers.push(marker);
			},
			(error) => {
				console.log(error.code);
			}
		);
	} else {
		console.log("Not Supported");
	}

	console.log(markers);
}

// getLocation.addEventListener("click", (event) => {
// 	if ("geolocation" in navigator) {
// 		navigator.geolocation.getCurrentPosition(
// 			(position) => {
// 				let latitude = position.coords.latitude;
// 				let longitude = position.coords.longitude;

// 				console.log("Lat", latitude, "Long", longitude);
// 			},
// 			(error) => {
// 				console.log(error.code);
// 			}
// 		);
// 	} else {
// 		console.log("Not Supported");
// 	}
// });
