const router = require("express").Router();
const { User, Post, Vote, Place, Message } = require("../../models");

router.get("/:id", (req, res) => {
	Message.findAll({
		where: {
			received_id: req.params.id,
		},
	})
		.then((dbUserData) => {
			if (!dbUserData) {
				res.status(404).json({ message: "No user found with this id" });
				return;
			}
			res.json(dbUserData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.post("/", (req, res) => {
	Message.create({
		sent_id: req.body.sent_id,
		received_id: req.body.received_id,
		message: req.body.message,
	})
		.then((dbMessageData) => res.json(dbMessageData))
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
