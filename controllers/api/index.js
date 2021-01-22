const router = require("express").Router();

const userRoutes = require("./user-routes");
const postRoutes = require("./post-routes");
const placeRoutes = require("./place-routes");
const messageRoutes = require("./message-routes");

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/places", placeRoutes);
router.use("/messages", messageRoutes);

module.exports = router;
