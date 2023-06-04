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
const Option = db.option;
const Thick = db.thick;
const TreeStatus = db.treeStatus;
const Fırın = db.fırın;

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
app.use("/api/oven", require("./routes/oven.routes"));

// verify jwt middleware
app.use(verifyJWT);
// protected routes
app.use("/api/customertracking", require("./routes/customerTracking.routes"));
app.use("/api/createLabel", require("./routes/createLabel.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/customers", require("./routes/customer.routes"));
app.use("/api/order", require("./routes/order.routes"));
app.use("/api/color", require("./routes/color.routes"));
app.use("/api/creator", require("./routes/creator.routes"));
app.use("/api/description", require("./routes/description.routes"));
app.use("/api/option", require("./routes/option.routes"));
app.use("/api/thick", require("./routes/thick.routes"));
app.use("/api/tree", require("./routes/tree.routes"));
app.use("/api/wax", require("./routes/wax.routes"));
app.use("/api/treeStatus", require("./routes/treeStatus.routes"));
app.use("/api/finishDay", require("./routes/finishDay.routes"));
app.use("/api/jobGroup", require("./routes/jobGroup.routes"));
app.use("/api/tree", require("./routes/tree.routes"));
app.use("/api/reports", require("./routes/report.routes"));

// db.sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("Synced db.");
//     initDB();
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });
db.sequelize.sync({ alter: true });
// db.sequelize.sync();

async function initDB() {
  await Role.create({
    id: 1,
    name: "user",
  });
  await Role.create({
    id: 2,
    name: "superuser",
  });
  await Role.create({
    id: 3,
    name: "admin",
  });
  await User.create({
    username: "adminDNE",
    email: "adminDNE@mail.com",
    password: bcrypt.hashSync(envConfig.ADMINPASS, 8),
    roleId: 3,
    isActive: 1,
  });
  await User.create({
    username: "user",
    email: "user@mail.com",
    password: bcrypt.hashSync(envConfig.ADMINPASS, 8),
    roleId: 1,
    isActive: 1,
  });
  await User.create({
    username: "superuser",
    email: "superuser@mail.com",
    password: bcrypt.hashSync(envConfig.ADMINPASS, 8),
    roleId: 2,
    isActive: 1,
  });
  await Wax.create({
    waxName: "Reçine",
  });
  await Wax.create({
    waxName: "Mavi Mum",
  });
  await TreeStatus.create({ treeStatusName: "Hazırlanıyor" });
  await TreeStatus.create({ treeStatusName: "Dökümde" });
  await TreeStatus.create({ treeStatusName: "Döküldü" });
  await TreeStatus.create({ treeStatusName: "Kesimde" });

  await Color.create({ colorName: "Kırmızı" });
  await Color.create({ colorName: "Yeşil" });
  await Color.create({ colorName: "Beyaz" });

  await Option.create({ optionText: "24 Ayar" });
  await Option.create({ optionText: "22 Ayar" });
  await Option.create({ optionText: "21 Ayar" });
  await Option.create({ optionText: "18 Ayar" });
  await Option.create({ optionText: "14 Ayar" });
  await Option.create({ optionText: "10 Ayar" });
  await Option.create({ optionText: "9 Ayar" });
  await Option.create({ optionText: "8 Ayar" });
  await Option.create({ optionText: "4 Ayar" });
  await Option.create({ optionText: "Alloy" });
  await Option.create({ optionText: "Bronz" });
  await Option.create({ optionText: "Gümüş" });
  await Thick.create({ thickName: "Çok Kalın" });
  await Thick.create({ thickName: "Kalın" });
  await Thick.create({ thickName: "Orta" });
  await Thick.create({ thickName: "İnce" });
  await Thick.create({ thickName: "Çok İnce" });
  await Fırın.create({
    fırınSıra: 1,
    fırınKonum: "ust",
  });

  await Fırın.create({
    fırınSıra: 1,
    fırınKonum: "alt",
  });
  await Fırın.create({
    fırınSıra: 2,
    fırınKonum: "ust",
  });
  await Fırın.create({
    fırınSıra: 2,
    fırınKonum: "alt",
  });
  await Fırın.create({
    fırınSıra: 3,
    fırınKonum: "ust",
  });
  await Fırın.create({
    fırınSıra: 3,
    fırınKonum: "alt",
  });
}

module.exports = app;
