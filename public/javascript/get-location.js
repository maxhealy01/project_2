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
                          <p>${markers[i].posts[0].post_content}</p>
													<h5 id="time">${time}
													<button type="submit" onclick="openMessage(event)">Message This User</button>
                          </h5>`,
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

function openMessage(event) {
	// Parse the window object to get to the poster's username
	let button = event.target;
	let windowDiv = button.closest("#time");
	let received_username = windowDiv.innerHTML.split(" ")[2];
	let sent_id = sessionStorage.getItem("id");

	windowDiv.removeChild(button);
	// Add a div for the input DOM element and the Send Button
	let newMessage = document.createElement("div");
	newMessage.id = "newMessage";

	// Create a title input area
	let messageEl = document.createElement("input");
	messageEl.id = "message";
	messageEl.setAttribute("type", "text");
	newMessage.appendChild(messageEl);

	// Create a button for submission
	let sendBtn = document.createElement("button");
	sendBtn.setAttribute("type", "submit");
	sendBtn.textContent = "Send Message";
	newMessage.appendChild(sendBtn);

	windowDiv.appendChild(newMessage);

	sendBtn.addEventListener("click", (event) => {
		event.preventDefault();
		sendMessage(received_username, sent_id);
	});
}

let sendMessage = (received_username, sent_id) => {
	let message = document.getElementById("message").value.trim();
	sent_id = sent_id.toString();
	const response = fetch(`/api/users/name/${received_username}`)
		.then((response) => response.json())
		.then((res) => {
			received_id = res.id;
			// Send the message to the database
			fetch(`/api/messages`, {
				method: "POST",
				body: JSON.stringify({
					sent_id,
					received_id,
					message,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
		});
};
