const router = require("express").Router();

const userRoutes = require("./user-routes");
const postRoutes = require("./post-routes");
const placeRoutes = require("./place-routes");

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/places", placeRoutes);

module.exports = router;
