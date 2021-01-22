const router = require("express").Router();
const { User, Post, Vote, Comment, Place } = require("../../models");

router.get("/", (req, res) => {
	Place.findAll({
		attributes: ["id", "city", "address", "latitude", "longitude"],
		include: [
			{
				model: Post,
				attributes: ["id", "title", "post_content", "user_id", "created_at"],
				include: [
					{
						model: User,
						attributes: ["username"],
					},
					{
						model: Comment,
						attributes: ["comment_text"],
					},
				],
			},
		],
	})
		.then((dbPlaceData) => res.json(dbPlaceData))
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.get("/:id", (req, res) => {
	Place.findOne({
		where: {
			id: req.params.id,
		},
		attributes: ["id", "city", "address", "latitude", "longitude"],
		include: [
			{
				model: Post,
				attributes: ["id", "title", "post_content", "user_id", "created_at"],
				include: [
					{
						model: User,
						attributes: ["username"],
					},
					{
						model: Comment,
						attributes: ["comment_text"],
					},
				],
			},
		],
	})
		.then((dbPlaceData) => {
			if (!dbPlaceData) {
				res.status(404).json({ message: "No place found with this id" });
				return;
			}
			res.json(dbPlaceData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.post("/", (req, res) => {
	Place.create({
		city: req.body.city,
		address: req.body.address,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
	})
		.then((dbPlaceData) => res.json(dbPlaceData))
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
