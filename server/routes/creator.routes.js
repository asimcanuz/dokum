var express = require("express");
const getCreators = require("../controllers/creator/getCreators");
const addCreator = require("../controllers/creator/addCreator");
const updateCreator = require("../controllers/creator/updateCreator");
const deleteCreator = require("../controllers/creator/deleteCreator");
const router = express.Router();

router.get("/", getCreators);
router.post("/", addCreator);
router.put("/", updateCreator);
router.delete("/", deleteCreator);

module.exports = router;
