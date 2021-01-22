const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment, Vote, Place } = require("../models");

router.get("/map", (req, res) => {
	Place.findAll({
		attributes: ["id", "city", "place_name", "latitude", "longitude"],
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
			const places = dbPlaceData.map((place) => place.get({ plain: true }));
			res.render("map", {
				places,
				loggedIn: req.session.loggedIn,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.get("/login", (req, res) => {
	if (req.session.loggedIn) {
		res.redirect("/map");
		return;
	}

	res.render("login");
});

module.exports = router;
