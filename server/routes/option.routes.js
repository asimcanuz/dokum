var express = require("express");
const getOptions = require("../controllers/option/getOptions");
const addOption = require("../controllers/option/addOption");
const updateOption = require("../controllers/option/updateOption");
const deleteOption = require("../controllers/option/deleteOption");

const router = express.Router();

router.get("/", getOptions);
router.post("/", addOption);
router.put("/", updateOption);
router.delete("/", deleteOption);

module.exports = router;
