var express = require("express");
const getAllNotFinished = require("../controllers/finishDay/getAllNotFinished");
const finishDayUpdate = require("../controllers/finishDay/finishDayUpdate");
const finishDayDateUpdate = require("../controllers/finishDay/finishDayDateUpdate");
const finishDayWithJobGroup = require("../controllers/finishDay/finishDayWithJobGroup");
var router = express.Router();

router.get("/", getAllNotFinished);
router.put("/", finishDayUpdate);
router.put("/date", finishDayDateUpdate);
router.put("/all", finishDayWithJobGroup);

module.exports = router;
