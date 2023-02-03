var express = require("express");
const router = express.Router();

const { verifyJWT } = require("../middleware");
const controller = require("../controllers/customer.controller");

router.get("/", verifyJWT, controller.getAllCustomers);
router.post("/addnew", verifyJWT, controller.addNewCustomer);
router.post("/update", verifyJWT, controller.updateCustomer);
router.post("/delete", verifyJWT, controller.deleteCustomer);

module.exports = router;
