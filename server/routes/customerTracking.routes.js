var express = require("express");
const getCustomerTracking = require("../controllers/customerTracking/getCustomerTracking");
const router = express.Router();

router.get("/", getCustomerTracking);

module.exports = router;
