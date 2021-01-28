const addPostBtn = document.getElementById("addpost");
const postArea = document.getElementById("postarea");

let addPost = () => {
	addPostBtn.remove();
	// Create a div for the new post
	let newPost = document.createElement("div");
	newPost.id = "newPost";

	// Create a title input area
	let titleDiv = document.createElement("div");
	titleDiv.id = "title";

	let titleArea = document.createElement("input");
	titleArea.setAttribute("type", "text");
	titleArea.placeholder = "Title";
	titleDiv.appendChild(titleArea);

	newPost.appendChild(titleDiv);

	// Create a body input area
	let body = document.createElement("textarea");
	body.setAttribute("type", "text");
	body.id = "body";
	body.placeholder = "What happened here?";
	newPost.appendChild(body);

	// Create a button for submission
	let submitDiv = document.createElement("div");
	submitDiv.id = "submitDiv";

	let submitBtn = document.createElement("button");
	submitBtn.setAttribute("type", "submit");
	submitBtn.textContent = "Submit Post";
	submitDiv.appendChild(submitBtn);
	newPost.appendChild(submitDiv);

	submitBtn.addEventListener("click", (event) => {
		event.preventDefault();
		submitPost();
	});

	// Attach the new post div to the post area element
	postArea.appendChild(newPost);
};

// This function retrieves information from the Google Maps API in order to put it into the Place table in the database
function submitPost() {
	console.log("submit");
	console.log(latitude, longitude);

	fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA-yWrlY4NA89Bb737Cfad_neoCwGciu2c
        `)
		.then((response) => response.json())
		.then((res) => {
			console.log("post-fetch");
			console.log("Check 2");

			let city = res.results[0].address_components[3].long_name;
			let address = res.results[0].formatted_address;
			console.log("Here I am!");
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
					console.log("Check 3");
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
}

addPostBtn.addEventListener("click", (event) => {
	event.preventDefault();
	addPost();
});
