var express = require("express");
const getAllNotFinished = require("../controllers/finishDay/getAllNotFinished");
const finishDayUpdate = require("../controllers/finishDay/finishDayUpdate");
const finishDayDateUpdate = require("../controllers/finishDay/finishDayDateUpdate");
var router = express.Router();

router.get("/", getAllNotFinished);
router.put("/", finishDayUpdate);
router.put("/date", finishDayDateUpdate);
module.exports = router;
