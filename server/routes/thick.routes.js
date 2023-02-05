var express = require("express");
const getThicks = require("../controllers/thick/getThicks");
const addThick = require("../controllers/thick/addThick");
const updateThick = require("../controllers/thick/updateThick");
const deleteThick = require("../controllers/thick/deleteThick");

const router = express.Router();

router.get("/", getThicks);
router.post("/", addThick);
router.put("/", updateThick);
router.delete("/", deleteThick);

module.exports = router;
