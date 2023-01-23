const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;
const Role = db.role;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.superUserBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

// get all users data (username,password,isActive,role)
exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: [
      "userId",
      "username",
      "password",
      "email",
      "roleId",
      "isActive",
    ],
  });
  if (!users) res.status(401).send({ message: "Users Not Found!" });
  res.status(200).send({ users });
};

exports.updateUser = async (req, res) => {
  const { email, isActive, username, roleId, userId } = req.body;
  if (!userId) res.status(401).send({ message: "User id not found!" });

  const user = await User.update(
    { email, isActive, username, roleId },
    {
      where: {
        userId,
      },
    }
  );

  if (!user) res.status(403).send({ message: "User update error " });

  res.status(200).send(user);
};

exports.passwordUpdate = async (req, res) => {
  const { password, userId } = req.body;
  if (!userId) res.status(401).send({ message: "User id not found!" });

  // şifreyi bcrypt'ten geçir
  // şifreyi güncelle
  const cryptedPass = bcrypt.hashSync(password, 8);
  const user = await User.update(
    { password: cryptedPass },
    {
      where: {
        userId,
      },
    }
  );

  if (!user) res.status(403).send({ message: "Pass update error " });

  res.status(200).send({ message: "Password Update" });
};

exports.addnew = async (req, res) => {
  const { email, isActive, username, roleId, password } = req.body;
  const cryptedPass = bcrypt.hashSync(password, 8);

  User.create({
    username,
    password: cryptedPass,
    email,
    roleId,
    isActive,
  })
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
