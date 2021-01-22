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

let submitPost = () => {
	let title = document.getElementById("title").value;
	let post_content = document.getElementById("body").value;

	console.log(title, post_content);
};

addPostBtn.addEventListener("click", (event) => {
	event.preventDefault();
	addPost();
});
