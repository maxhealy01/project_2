const addPostBtn = document.getElementById("addpost");
const postArea = document.getElementById("postarea");

let addPost = () => {
	// Create a div for the new post
	let newPost = document.createElement("div");
	newPost.id = "newPost";

	// Create a title input area
	let titleDiv = document.createElement("input");
	titleDiv.setAttribute("type", "text");
	titleDiv.id = "title";
	titleDiv.placeholder = "Title";
	newPost.appendChild(titleDiv);

	// Create a body input area
	let body = document.createElement("input");
	body.setAttribute("type", "text");
	body.id = "body";
	body.placeholder = "What happened here?";
	newPost.appendChild(body);

	// Create a button for submission
	let submitBtn = document.createElement("button");
	submitBtn.setAttribute("type", "submit");
	submitBtn.textContent = "Submit Post";
	newPost.appendChild(submitBtn);

	submitBtn.addEventListener("click", (event) => {
		event.preventDefault();
		getPlace();
	});

	// Attach the new post div to the post area element
	postArea.appendChild(newPost);
};

// This function retrieves information from the Google Maps API in order to put it into the Place table in the database
function getPlace() {
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				let latitude = position.coords.latitude;
				let longitude = position.coords.longitude;

				fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA-yWrlY4NA89Bb737Cfad_neoCwGciu2c
        `)
					.then((response) => response.json())
					.then((res) => {
						let city = res.results[0].address_components[3].long_name;
						let address = res.results[0].formatted_address;

						fetch(`/api/places`, {
							method: "POST",
							body: JSON.stringify({
								city,
								address,
								latitude,
								longitude,
							}),
							headers: {
								"Content-Type": "application/json",
							},
						}).then((response) => {
							console.log(sessionStorage.getItem("id"));
							response.json();
						});
						// .then((res) => {
						// 	fetch(`/api/posts`, {
						//     method: "POST",
						//     body: JSON.stringify({
						//       title: titleDiv.value.trim(),
						//       post_content: body.value.trim(),

						//     })
						//   });
						// });
					});

				// if (response.ok) {
				// 	console.log(response);
				// }
			},
			(error) => {
				console.log(error.code);
			}
		);
	} else {
		console.log("Not Supported");
	}
}

let createPlace = () => {
	getPlace().then((response) => {
		console.log(response);
	});
};

function submitPost(event) {
	event.preventDefault();

	let title = document.getElementById("title").value;
	let post_content = document.getElementById("body").value;

	console.log(title, post_content);
}

addPostBtn.addEventListener("click", (event) => {
	event.preventDefault();
	addPost();
});
