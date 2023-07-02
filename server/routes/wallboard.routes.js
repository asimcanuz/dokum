var express = require("express");
const getWallboards = require("../controllers/wallboard/getWallboards");

const router = express.Router();

router.get("/", getWallboards);

module.exports = router;
