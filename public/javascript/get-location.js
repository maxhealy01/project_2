let markers = [];

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
				var options = {
					center: { lat: latitude, lng: longitude },
					zoom: 16,
				};

				map = new google.maps.Map(document.getElementById("map"), options);

				let marker = new google.maps.Marker({
					position: {
						lat: latitude,
						lng: longitude,
					},
					map: map,
				});
				const response = fetch("/api/places")
					.then((response) => response.json())
					.then((res) => {
						let markers = res;
						// Create a marker for each place in the DB
						for (i = 0; i < markers.length; i++) {
							let latitude = Number(markers[i].latitude);
							let longitude = Number(markers[i].longitude);
							let marker = new google.maps.Marker({
								position: {
									lat: latitude,
									lng: longitude,
								},
								map: map,
							});
							// Format the created_at date
							console.log(markers[0].posts[0].created_at);
							let date = new Date(markers[i].posts[0].created_at);
							let dateString = date.toString();
							let time = `Posted by ${
								markers[i].posts[0].user.username
							} on ${dateString.slice(
								4,
								7
							)} ${date.getDate()} at ${date.getHours()}:${date.getMinutes()} `;
							// Create an info window for each marker
							let infoWindow = new google.maps.InfoWindow({
								content: `<h3>${markers[i].posts[0].title}</h3>
                          <h5>${time}</h5>
                          <p>${markers[i].posts[0].post_content}</p>
                          `,
							});
							// Make the info window clickable
							marker.addListener("click", function () {
								infoWindow.open(map, marker);
							});
						}
					});
			},
			(error) => {
				console.log(error.code);
			}
		);
	} else {
		console.log("Not Supported");
	}
}
