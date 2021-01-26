let inbox = document.getElementById("inbox");

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
				let username = userData[user_id - 1].username;
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
						console.log(convoArray, userData);
					}
				}

				console.log(convoArray);

				// Create DOM elements to display the chats
				for (i = 0; i < convoArray.length; i++) {
					let otherUsername = convoArray[i][0].username;
					// Create a div for the new chat area
					let newChat = document.createElement("div");
					newChat.className = "chat";

					let heading = document.createElement("h3");
					heading.textContent = `Your messages with ${otherUsername}`;
					newChat.appendChild(heading);

					newChat.id = convoArray[i][0].convo_id;

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
						messageText.textContent = `${messageUsername} at ${time}: ${message}`;
						newChat.appendChild(messageText);
					}
					// Create an area for a new message
					let messageArea = document.createElement("input");
					messageArea.className = "messageText";
					newChat.appendChild(messageArea);

					let sendBtn = document.createElement("button");
					sendBtn.setAttribute("type", "submit");
					sendBtn.textContent = "Send Message";
					newChat.appendChild(sendBtn);

					inbox.appendChild(newChat);

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