const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const envConfig = require("../config/env.config");

exports.signup = async (req, res) => {
  const { username, password, role, email } = req.body;

  const cryptedPass = bcrypt.hashSync(password, 8);

  const roleId = await Role.findOne({
    where: {
      name: role,
    },
  }).then((role) => role.id);

  User.create({
    username,
    password: cryptedPass,
    email,
    roleId,
  })
    .then((user) => {
      res.status(200).send({ message: "User was registered successfully!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = async (req, res) => {
  const { username, password } = req.body;

  // found user
  const foundUser = await User.findOne({
    where: {
      username,
    },
  });

  // not found user
  if (!foundUser)
    return res
      .status(401)
      .send({ type: "username", message: "Kullanıcı Adı Hatalıdır!" });

  // match crypted password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // get user role
    const role = await Role.findOne({
      where: {
        id: foundUser.roleId,
      },
    });
    // create access token
    const accessToken = jwt.sign(
      {
        username: foundUser.username,
        id: foundUser.userId,
        role: role.name.toUpperCase(),
      },
      envConfig.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "2m",
      }
    );
    // create refresh token
    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
        id: foundUser.userId,
        role: role.name.toUpperCase(),
      },
      envConfig.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // saving refresh token with current user
    await User.update(
      { refreshToken },
      {
        where: {
          userId: foundUser.userId,
        },
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      // secure: true,
      // sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24hr to ms
    });
    res.status(200).send({
      id: foundUser.userId,
      username: foundUser.username,
      email: foundUser.email,
      password,
      role: role.name.toUpperCase(),
      accessToken: accessToken,
    });
  } else {
    return res.status(401).send({
      accessToken: null,
      type: "password",
      message: "Girilen şifre hatalıdır!",
    });
  }
};

exports.logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;
  // found user
  const foundUser = await User.findOne({
    where: {
      refreshToken,
    },
  });
  // not found user
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.sendStatus(403);
  }

  // delete refresh token in db
  await User.update(
    { refreshToken: "" },
    {
      where: {
        userId: foundUser.userId,
      },
    }
  );
  res.clearCookie("jwt", {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.sendStatus(204);
};
