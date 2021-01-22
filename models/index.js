const User = require("./User");
const Place = require("./Place");
const Post = require("./Post");
const Vote = require("./Vote");
const Message = require("./Message");

// Post + user associations
User.hasMany(Post, {
	foreignKey: "user_id",
});

Post.belongsTo(User, {
	foreignKey: "user_id",
});

User.belongsToMany(Post, {
	through: Vote,
	as: "voted_posts",
	foreignKey: "user_id",
});

Post.belongsToMany(User, {
	through: Vote,
	as: "voted_posts",
	foreignKey: "post_id",
});

// Vote associations
Vote.belongsTo(User, {
	foreignKey: "user_id",
});

Vote.belongsTo(Post, {
	foreignKey: "post_id",
});

User.hasMany(Vote, {
	foreignKey: "user_id",
});

Post.hasMany(Vote, {
	foreignKey: "post_id",
});

// Place associations
Place.hasMany(Post, {
	foreignKey: "place_id",
});

Post.belongsTo(Place, {
	foreignKey: "place_id",
});

// Message associations
Message.belongsTo(User, {
	foreignKey: "user_id",
});

User.hasMany(Message, {
	foreignKey: "user_id",
	as: "received_id",
});

User.hasMany(Message, {
	foreignKey: "user_id",
	as: "sent_id",
});

module.exports = { User, Post, Vote, Place };
