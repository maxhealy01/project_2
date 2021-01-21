const router = require("express").Router();
const { Post, User, Vote, Comment, Place } = require("../../models");
const sequelize = require("../../config/connection");

router.get("/", (req, res) => {
	console.log("==============");
	Post.findAll({
		attributes: [
			"id",
			"post_content",
			"title",
			"created_at",
			[
				sequelize.literal(
					"(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
				),
				"vote_count",
			],
		],
		order: [["created_at", "DESC"]],
		include: [
			{
				model: Comment,
				attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
				include: {
					model: User,
					attributes: ["username"],
				},
			},
			{
				model: User,
				attributes: ["username"],
			},
			{
				model: Place,
				attributes: ["city", "place_name", "latitude", "longitude"],
			},
		],
	})
		.then((dbPostData) => res.json(dbPostData))
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.get("/:id", (req, res) => {
	Post.findOne({
		where: {
			id: req.params.id,
		},
		attributes: [
			"id",
			"post_content",
			"title",
			"created_at",
			[
				sequelize.literal(
					"(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
				),
				"vote_count",
			],
		],
		include: [
			{
				model: Comment,
				attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
				include: {
					model: User,
					attributes: ["username"],
				},
			},
			{
				model: User,
				attributes: ["username"],
			},
			{
				model: Place,
				attributes: ["city", "place_name", "latitude", "longitude"],
			},
		],
	})
		.then((dbPostData) => {
			if (!dbPostData) {
				res.status(404).json({ message: "No post found with this id" });
				return;
			}
			res.json(dbPostData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.post("/", (req, res) => {
	Post.create({
		title: req.body.title,
		post_content: req.body.post_content,
		user_id: req.session.user_id,
		place_id: req.body.place_id,
	})
		.then((dbPostData) => res.json(dbPostData))
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// PUT /api/posts/upvote
router.put("/upvote", (req, res) => {
	// custom static method created in models/Post-js
	if (req.session) {
		Post.upvote(
			{ ...req.body, user_id: req.session.user_id },
			{ Vote, Comment, User }
		)
			.then((updatedVoteData) => res.json(updatedVoteData))
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	}
});

router.put("/:id", (req, res) => {
	Post.update(
		{
			title: req.body.title,
		},
		{
			where: {
				id: req.params.id,
			},
		}
	)
		.then((dbPostData) => {
			if (!dbPostData) {
				res.status(404).json({ message: "No post found with this id" });
				return;
			}
			res.json(dbPostData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.delete("/:id", (req, res) => {
	Post.destroy({
		where: {
			id: req.params.id,
		},
	})
		.then((dbPostData) => {
			if (!dbPostData) {
				res.status(404).json({ message: "No post found with this id" });
				return;
			}
			res.json(dbPostData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
