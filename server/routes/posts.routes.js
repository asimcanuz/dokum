var express = require("express");
const router = express.Router();

const data = require("../mock/posts.json");

router.get("/", (req, res) => {
  res.json({ posts: data });
});

module.exports = router;
