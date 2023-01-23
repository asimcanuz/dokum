var express = require("express");
const router = express.Router();

const { authJwt, verifyJWT } = require("../middleware");
const controller = require("../controllers/user.controller");

router.get("/", verifyJWT, controller.getAllUsers);
router.post("/update", verifyJWT, controller.updateUser);
router.post("/passwordupdate", verifyJWT, controller.passwordUpdate);
router.post("/addnew", verifyJWT, controller.addnew);
module.exports = router;
