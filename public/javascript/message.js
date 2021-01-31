let inbox = document.getElementById("inbox");
var collapseElementList = [].slice.call(document.querySelectorAll(".collapse"));
var collapseList = collapseElementList.map(function (collapseEl) {
	return new bootstrap.Collapse(collapseEl);
});

fetch(`/api/messages/${sessionStorage.getItem("id")}`, {
	method: "GET",
	headers: {
		"Content-Type": "application/json",
	},
})
	.then((res) => res.json())
	.then((messageArray) => {
		fetch(`/api/users`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((userData) => {
				console.log("userdata", userData);

				// Get the username of the user whose inbox this is
				let user_id = sessionStorage.getItem("id");
				for (i = 0; i < userData.length; i++) {
					if (userData[i].id === user_id) {
						let username = userData[i].username;
					}
				}
				console.log("First message array", messageArray);

				let convoArray = [];

				// Create a conversation ID to sort the messages into conversations between two users
				for (var i = 0; i < messageArray.length; i++) {
					let convo_id = messageArray[i].sent_id + messageArray[i].received_id;
					messageArray[i].convo_id = convo_id;
				}

				// Create a new array separated into conversations based on convo_id
				for (var i = 0; i < messageArray.length; i++) {
					if (!convoArray[messageArray[i].convo_id])
						convoArray[messageArray[i].convo_id] = [];
					convoArray[messageArray[i].convo_id].push(messageArray[i]);
				}

				// Get rid of any empty arrays inside the array of messages
				convoArray = convoArray.filter((item) => item.length);

				// Find the username of the user that each message pertains to
				for (i = 0; i < convoArray.length; i++) {
					for (j = 0; j < convoArray[i].length; j++) {
						convoArray[i][j].username =
							userData[convoArray[i][j].sent_id - 1].username;
					}
				}
				// Create DOM elements to display the chats
				for (i = 0; i < convoArray.length; i++) {
					let number = capitalizeFirstLetter(inWords(i + 1)).trim();

					let otherUsername = convoArray[i][0].username;
					// Create a div for the new chat area
					let newChat = document.createElement("div");
					newChat.className = "accordion-item";
					inbox.appendChild(newChat);

					let heading = document.createElement("h2");
					heading.className = "accordion-header";
					heading.id = `heading${number}`;
					newChat.appendChild(heading);

					let accordionButton = document.createElement("button");
					accordionButton.textContent = `Your messages with ${otherUsername}`;
					accordionButton.className = "accordion-button";
					accordionButton.setAttribute("type", "button");
					accordionButton.setAttribute("data-bs-toggle", "collapse");
					accordionButton.setAttribute("data-bs-target", `#collapse${number}`);
					accordionButton.setAttribute("aria-expanded", "true");
					if (i >= 0) {
						accordionButton.className = "accordion-button collapsed";
						accordionButton.setAttribute("aria-expanded", "false");
					}
					accordionButton.setAttribute("aria-controls", `collapse${number}`);
					heading.appendChild(accordionButton);

					let infoDiv = document.createElement("div");
					infoDiv.id = `collapse${number}`;
					infoDiv.className = "accordion-collapse collapse show";
					if (i >= 0) {
						infoDiv.className = "accordion-collapse collapse";
					}
					infoDiv.setAttribute("aria-labelledby", `heading${number}`);
					infoDiv.setAttribute("data-bs-parent", "#inbox");
					newChat.appendChild(infoDiv);

					let messageContent = document.createElement("div");
					messageContent.className = "accordion-body";
					infoDiv.append(messageContent);

					for (j = 0; j < convoArray[i].length; j++) {
						let date = new Date(convoArray[i][j].createdAt);
						let dateString = date.toString();
						let time = `${dateString.slice(
							4,
							7
						)} ${date.getDate()} at ${date.getHours()}:${date.getMinutes()} `;
						let message = convoArray[i][j].message;
						let messageUsername = convoArray[i][j].username;

						// Create DOM elements for individual messages
						var messageText = document.createElement("p");
						messageText.className = "message";
						messageText.textContent = `${messageUsername} on ${time}: ${message}`;
						messageContent.appendChild(messageText);
					}
					// Create an area for a new message
					let messageArea = document.createElement("input");
					messageArea.className = "messageText";
					messageContent.appendChild(messageArea);

					let sendBtn = document.createElement("button");
					sendBtn.setAttribute("type", "submit");
					sendBtn.textContent = "Send Message";
					messageContent.appendChild(sendBtn);

					let convoId = convoArray[i][0].convo_id;
					sendBtn.addEventListener("click", (event) => {
						event.preventDefault();

						messageUser(user_id, convoId, messageArea);
					});
				}
				console.log("convoarray", convoArray);
			});

		// Create DOM elements that show the messages
	});

let messageUser = (user_id, convoId, messageArea) => {
	messageContent = messageArea.value.trim();
	other_id = convoId - user_id;

	// Send the message and reload the page
	fetch(`/api/messages`, {
		method: "POST",
		body: JSON.stringify({
			sent_id: user_id,
			received_id: other_id,
			message: messageContent,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});
	document.location.reload();
};
