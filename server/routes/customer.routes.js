var express = require("express");
const router = express.Router();

const controller = require("../controllers/customer.controller");

router.get("/", controller.getAllCustomers);
router.post("/addnew", controller.addNewCustomer);
router.post("/update", controller.updateCustomer);
router.post("/delete", controller.deleteCustomer);
router.post(
  "/getAllCustomersLimitization",
  controller.getAllCustomersLimitization
);

module.exports = router;
