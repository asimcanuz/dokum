var express = require("express");
const getTrees = require("../controllers/tree/getTrees");
const addTree = require("../controllers/tree/addTree");
const updateTree = require("../controllers/tree/updateTree");
const getTodayTrees = require("../controllers/tree/getTodayTrees");
const passiveTree = require("../controllers/tree/passiveTree");
const updateMineralWeight = require("../controllers/tree/updateMineralWeight");

const router = express.Router();

router.get("/", getTrees);
router.get("/today", getTodayTrees);
router.post("/", addTree);
router.put("/", updateTree);
router.put("/passive", passiveTree);
router.put("/mineralWeight", updateMineralWeight);

module.exports = router;
