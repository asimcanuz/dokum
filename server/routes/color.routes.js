var express = require("express");
const getColors = require("../controllers/colors/getColors");
const addColor = require("../controllers/colors/addColor");
const updateColor = require("../controllers/colors/updateColor");
const deleteColor = require("../controllers/colors/deleteColor");

const router = express.Router();

router.get("/", getColors);
router.post("/", addColor);
router.put("/", updateColor);
router.delete("/", deleteColor);

module.exports = router;
