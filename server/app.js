var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bcrypt = require("bcryptjs");

const db = require("./models");
const Role = db.role;
const User = db.user;

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

<<<<<<< HEAD
// for production delete force true and response
=======
console.log("test");

const db = require("./models");
>>>>>>> bddeb462be4490850916a0241ee39f18ccda5cc9
db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Synced db.");
    initDB();
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

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
}

module.exports = app;
