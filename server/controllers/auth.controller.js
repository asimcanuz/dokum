const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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

  User.findOne({
    where: {
      username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.userId }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      Role.findOne({
        where: {
          id: user.roleId,
        },
      }).then((role) => {
        if (!role) {
          res.status(400).send({ message: "Role is not defined!" });
        }
        res.status(200).send({
          id: user.userId,
          username: user.username,
          email: user.email,
          role: role.name.toUpperCase(),
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
