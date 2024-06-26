const jwt = require("jsonwebtoken");
const envConfig = require("../config/env.config");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // invalid token
    }
    req.user = decoded.username;
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyJWT;
