var express = require("express");
const addOrder = require("../controllers/order/addOrder");
const deleteOrder = require("../controllers/order/deleteOrder");
const getOrders = require("../controllers/order/getOrders");
const router = express.Router();

router.get("/", getOrders);
router.post("/", addOrder);
router.delete("/", deleteOrder);

module.exports = router;
