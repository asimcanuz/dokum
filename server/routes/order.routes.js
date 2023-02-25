var express = require("express");
const addOrder = require("../controllers/order/addOrder");
const router = express.Router();

router.post("/", addOrder);

module.exports = router;
