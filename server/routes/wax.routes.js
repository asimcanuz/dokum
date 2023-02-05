var express = require("express");
const getWaxes = require("../controllers/wax/getWaxes");
const addWax = require("../controllers/wax/addWax");
const updateWax = require("../controllers/wax/updateWax");
const deleteWax = require("../controllers/wax/deleteWax");
const router = express.Router();

router.get("/", getWaxes);
router.post("/", addWax);
router.put("/", updateWax);
router.delete("/", deleteWax);

module.exports = router;
