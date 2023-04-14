var express = require("express");
const router = express.Router();

const getJobGroupList = require("../controllers/jobGroup/getJobGroupList");
const addNewJobGroup = require("../controllers/jobGroup/addNewJobGroup");

router.get("/", getJobGroupList);
router.post("/", addNewJobGroup);

module.exports = router;
