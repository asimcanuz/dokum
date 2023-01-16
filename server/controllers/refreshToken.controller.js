const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

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
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const role = decoded.role;
    const username = decoded.username;

    const accessToken = jwt.sign(
      {
        username: decoded.username,
        id: decoded.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30s",
      }
    );

    res.json({ role, username, accessToken });
  });
};

module.exports = { handleRefreshToken };
