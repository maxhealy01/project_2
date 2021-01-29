let markers = [];
let latitude = Number(sessionStorage.getItem("latitude"));
let longitude = Number(sessionStorage.getItem("longitude"));
if (latitude === 0) {
	latitude = 30.2729;
}
if (longitude === 0) {
	longitude = 97.7444;
}

function initMap() {
	var options = {
		enableHighAccuracy: true,
		center: { lat: latitude, lng: longitude },
		zoom: 16,
	};
	map = new google.maps.Map(document.getElementById("map"), options);
	console.log(latitude, longitude, options);
	let marker = new google.maps.Marker({
		position: {
			lat: latitude,
			lng: longitude,
		},
		map: map,
	});
	console.log("Yo");
	const response = fetch(`/api/posts`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((res) => {
			populateMarkers(res);
		});
}

function populateMarkers(markers) {
	// Create a marker for each place in the DB
	for (i = 0; i < markers.length; i++) {
		// I'm adding + i * 0.0001 as a temporary failsafe. Because navigator.geolocation is not getting the correct coordinates, this enables multiple markers to be posted on the "same spot"
		let offset = i * 0.000001;
		latitude = Number(markers[i].place.latitude) + offset;
		longitude = Number(markers[i].place.longitude) + offset;
		let marker = new google.maps.Marker({
			position: {
				lat: latitude,
				lng: longitude,
			},
			map: map,
		});
		// Format the created_at date
		let date = new Date(markers[i].created_at);
		let dateString = date.toString();
		let time = `Posted by ${markers[i].user.username} on ${dateString.slice(
			4,
			7
		)} ${date.getDate()} at ${date.getHours()}:${date.getMinutes()} `;
		// Create an info window for each marker
		let infoWindow = new google.maps.InfoWindow({
			content: `<h5>${markers[i].title}</h5>
	                <p>${markers[i].post_content}</p>
									<h6 id="time">${time}
									<button type="submit" onclick="openMessage(event)">Message This User</button>
	                </h6>`,
		});

		// Make the info window clickable
		marker.addListener("click", function () {
			infoWindow.open(map, marker);
		});
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
