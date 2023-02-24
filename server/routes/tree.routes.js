var express = require("express");
const getTrees = require("../controllers/tree/getTrees");
const addTree = require("../controllers/tree/addTree");
const getTodayTrees = require("../controllers/tree/getTodayTrees");
const router = express.Router();

router.get("/", getTrees);
router.get("/today", getTodayTrees);
router.post("/", addTree);

module.exports = router;
