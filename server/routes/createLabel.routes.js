var express = require("express");
const router = express.Router();

const createLabel = require("../controllers/createLabel.controller");
router.get("/", createLabel);

module.exports = router;
