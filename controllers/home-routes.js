const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Vote, Place, Message } = require("../models");
const Sequelize = require("sequelize");

router.get("/", (req, res) => {
	res.render("homepage");
});
router.get("/map", (req, res) => {
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

router.get("/inbox", (req, res) => {
	res.render("inbox", { loggedIn: req.session.loggedIn });
});

module.exports = router;
