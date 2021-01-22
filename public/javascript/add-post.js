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
		submitPost();
	});

	// Attach the new post div to the post area element
	postArea.appendChild(newPost);
};

// This function retrieves information from the Google Maps API in order to put it into the Place table in the database
function submitPost() {
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
						// Add the location to the places table
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
						})
							.then((response) => response.json())
							// Add the post to the database
							.then((res) => {
								let title = document.getElementById("title").value.trim();
								let post_content = document.getElementById("body").value.trim();
								let user_id = sessionStorage.getItem("id");
								let place_id = res.id;
								console.log(title, post_content, user_id, place_id);
								fetch(`/api/posts`, {
									method: "POST",
									body: JSON.stringify({
										title,
										post_content,
										user_id,
										place_id,
									}),
									headers: {
										"Content-Type": "application/json",
									},
								});
							})
							.then(() => document.location.reload());
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

addPostBtn.addEventListener("click", (event) => {
	event.preventDefault();
	addPost();
});