var express = require("express");
const router = express.Router();

const getJobGroupList = require("../controllers/jobGroup/getJobGroupList");
const addNewJobGroup = require("../controllers/jobGroup/addNewJobGroup");
const updateErkenFirin = require("../controllers/jobGroup/updateErkenFirin");

router.get("/", getJobGroupList);
router.post("/", addNewJobGroup);
router.put("/", updateErkenFirin);

module.exports = router;
