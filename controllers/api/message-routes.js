const router = require("express").Router();
const { User, Post, Vote, Place, Message } = require("../../models");
const { encrypt, decrypt } = require("../../utils/crypto");
const Sequelize = require("sequelize");

// This endpoint retrieves all the messages that a user has received
router.get("/received/:id", (req, res) => {
	Message.findAll({
		where: {
			received_id: req.params.id,
		},
	})
		.then((messages) => {
			if (!messages) {
				res.status(404).json({ message: "No user found with this id" });
				return;
			}

			for (i = 0; i < messages.length; i++) {
				message = decrypt(JSON.parse(messages[i].message));
				messages[i].message = message;
			}

			res.json(messages);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// This endpoint retrieves all the messages that a user has sent
router.get("/sent/:id", (req, res) => {
	Message.findAll({
		where: {
			sent_id: req.params.id,
		},
	})
		.then((messages) => {
			if (!messages) {
				res.status(404).json({ message: "No user found with this id" });
				return;
			}
			for (i = 0; i < messages.length; i++) {
				message = decrypt(JSON.parse(messages[i].message));
				messages[i].message = message;
			}
			res.json(messages);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

//This endpoint gets all the sent and received messages of a single user
router.get("/:id", (req, res) => {
	Message.findAll({
		where: Sequelize.or(
			{ received_id: req.params.id },
			{ sent_id: req.params.id }
		),
	})
		.then((messages) => {
			if (!messages) {
				res.status(404).json({ message: "No user found with this id" });
				return;
			}
			for (i = 0; i < messages.length; i++) {
				message = decrypt(JSON.parse(messages[i].message));
				messages[i].message = message;
			}
			res.json(messages);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.post("/", (req, res) => {
	let encryptedMessage = JSON.stringify(encrypt(req.body.message));
	Message.create({
		sent_id: req.body.sent_id,
		received_id: req.body.received_id,
		message: encryptedMessage,
	})
		.then((dbMessageData) => res.json(dbMessageData))
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// This will update the messages to *read* status when the user has read them
router.put("/:id", (req, res) => {
	Message.update(
		{
			read: true,
		},
		{ where: { received_id: req.params.id } }
	)
		.then((messages) => {
			res.json(messages);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
