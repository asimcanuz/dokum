var express = require("express");
const router = express.Router();

const getJobGroupList = require("../controllers/jobGroup/getJobGroupList");
const addNewJobGroup = require("../controllers/jobGroup/addNewJobGroup");
const updateErkenFirin = require("../controllers/jobGroup/updateErkenFirin");
const getJobGroupListNo = require("../controllers/jobGroup/getJobGroupListNo");

router.get("/", getJobGroupList);
router.post("/", addNewJobGroup);
router.get("/listNo", getJobGroupListNo);
router.put("/", updateErkenFirin);

module.exports = router;
