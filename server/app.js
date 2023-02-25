var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bcrypt = require("bcryptjs");
var cors = require("cors");

const envConfig = require("./config/env.config");
const db = require("./models");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");

require("dotenv").config();

const Role = db.role;
const User = db.user;
const Wax = db.wax;
const Color = db.color;
const Creator = db.creator;
const Customer = db.customer;
const Description = db.description;
const Option = db.option;
const Order = db.order;
const Thick = db.thick;
const TreeStatus = db.treeStatus;

var app = express();

app.use(logger("dev"));
app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// routes
//public routes for auth and refresh token
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/refresh", require("./routes/refresh.routes"));
app.use("/api/order", require("./routes/order.routes"));
app.use("/api/tree", require("./routes/tree.routes"));

// verify jwt middleware
app.use(verifyJWT);
//protected routes
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/customers", require("./routes/customer.routes"));
// app.use("/api/order", require("./routes/order.routes"));
app.use("/api/color", require("./routes/color.routes"));
app.use("/api/creator", require("./routes/creator.routes"));
app.use("/api/description", require("./routes/description.routes"));
app.use("/api/option", require("./routes/option.routes"));
app.use("/api/thick", require("./routes/thick.routes"));
// app.use("/api/tree", require("./routes/tree.routes"));
app.use("/api/wax", require("./routes/wax.routes"));
app.use("/api/treeStatus", require("./routes/treeStatus.routes"));
console.log(`NODE_ENV=${envConfig.NODE_ENV}`);

// db.sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("Synced db.");
//     initDB();
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });
db.sequelize.sync();

function initDB() {
  Role.create({
    id: 1,
    name: "user",
  });
  Role.create({
    id: 2,
    name: "superuser",
  });
  Role.create({
    id: 3,
    name: "admin",
  });
  User.create({
    username: "adminDNE",
    email: "adminDNE@mail.com",
    password: bcrypt.hashSync(envConfig.ADMINPASS, 8),
    roleId: 3,
    isActive: 1,
  });
  User.create({
    username: "user",
    email: "user@mail.com",
    password: bcrypt.hashSync(envConfig.ADMINPASS, 8),
    roleId: 1,
    isActive: 1,
  });
  User.create({
    username: "superuser",
    email: "superuser@mail.com",
    password: bcrypt.hashSync(envConfig.ADMINPASS, 8),
    roleId: 2,
    isActive: 1,
  });
  Wax.create({
    waxName: "wax",
  });
  Color.create({ colorName: "renk" });
  Creator.create({ creatorName: "hazırlayan" });
  Description.create({ descriptionText: "açıklama" });
  Option.create({ optionText: "ayar" });
  Thick.create({ thickName: "kalınlık" });
  TreeStatus.create({ treeStatusName: "tree" });
}

module.exports = app;
