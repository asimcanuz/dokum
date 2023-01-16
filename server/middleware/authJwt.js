const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    Role.findOne({
      where: {
        id: user.roleId,
      },
    }).then((role) => {
      if (role.name === "admin") {
        next();
        return;
      }
      res.status(403).send({
        message: "Require Admin Role!",
      });
      return;
    });
  });
};

isSuperuser = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    Role.findOne({
      where: {
        id: user.roleId,
      },
    }).then((role) => {
      if (role.name === "superuser") {
        next();
        return;
      }
      res.status(403).send({
        message: "Require Super User Role!",
      });
      return;
    });
  });
};

isSuperuserOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    Role.findOne({
      where: {
        id: user.roleId,
      },
    }).then((role) => {
      if (roles[i].name === "superuser") {
        next();
        return;
      }

      if (roles[i].name === "admin") {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Moderator or Admin Role!",
      });
      return;
    });
  });
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {}
    });
  });
};

const authJwt = {
  isAdmin: isAdmin,
  isSuperuser: isSuperuser,
  isSuperuserOrAdmin: isSuperuserOrAdmin,
};
module.exports = authJwt;
