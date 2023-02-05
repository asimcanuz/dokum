const db = require("../models");
const User = db.user;
const envConfig = require("../config/env.config");
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  // found user
  const foundUser = await User.findOne({
    where: {
      refreshToken,
    },
  });
  // not found user
  if (!foundUser) return res.sendStatus(403);

  // evaluate jwt
  jwt.verify(refreshToken, envConfig.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const role = decoded.role;
    const username = decoded.username;
    const id = decoded.id;
    const accessToken = jwt.sign(
      {
        username: decoded.username,
        id: decoded.id,
      },
      envConfig.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30s",
      }
    );

    res.json({ role, username, id, accessToken });
  });
};

module.exports = { handleRefreshToken };
