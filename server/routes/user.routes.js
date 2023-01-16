var express = require("express");
const router = express.Router();

const { authJwt, verifyJWT } = require("../middleware");
const controller = require("../controllers/user.controller");

router.get("/api/test/all", controller.allAccess);

router.get("/api/test/user", controller.userBoard);

router.get("/api/test/super", [authJwt.isSuperuser], controller.superUserBoard);

router.get("/admin", [authJwt.isAdmin], controller.adminBoard);

module.exports = router;
