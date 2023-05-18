var express = require("express");
const getTreeStatuses = require("../controllers/treeStatus/getTreeStatus");
const addTreeStatus = require("../controllers/treeStatus/addTreeStatus");
const updateTreeStatus = require("../controllers/treeStatus/updateTreeStatus");
const deleteTreeStatus = require("../controllers/treeStatus/deleteTreeStatus");
const router = express.Router();

router.get("/", getTreeStatuses);
router.post("/", addTreeStatus);
router.put("/", updateTreeStatus);
router.delete("/", deleteTreeStatus);

module.exports = router