var express = require("express");

const getDescriptions = require("../controllers/description/getDescriptions");
const addDescription = require("../controllers/description/addDescription");
const deleteDescription = require("../controllers/description/deleteDescription");
const updateDescription = require("../controllers/description/updateDescription");

const router = express.Router();

router.get("/", getDescriptions);
router.post("/", addDescription);
router.put("/", updateDescription);
router.delete("/", deleteDescription);

module.exports = router;
