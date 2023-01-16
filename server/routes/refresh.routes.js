const express = require("express");
const {
  handleRefreshToken,
} = require("../controllers/refreshToken.controller");

const router = express.Router();

router.get("/", handleRefreshToken);

module.exports = router;
