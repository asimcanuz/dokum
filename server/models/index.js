const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// import models
db.user = require("./user.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);
db.customer = require("./customer.model")(sequelize, Sequelize);
db.description = require("./description.model")(sequelize, Sequelize);
db.order = require("./order.model")(sequelize, Sequelize);
db.tree = require("./tree.model")(sequelize, Sequelize);
db.option = require("./option.model")(sequelize, Sequelize);
db.creator = require("./creator.model")(sequelize, Sequelize);
db.treeStatus = require("./treeStatus.model")(sequelize, Sequelize);
db.thick = require("./thick.model")(sequelize, Sequelize);
db.wax = require("./wax.model")(sequelize, Sequelize);
db.color = require("./color.model")(sequelize, Sequelize);

// user role 1-1
db.role.hasOne(db.user);
db.user.belongsTo(db.role);

//customer tree n-n
db.customer.belongsToMany(db.tree, { through: "customerTrees" });
db.tree.belongsToMany(db.customer, { through: "customerTrees" });

db.ROLES = ["user", "superuser", "admin"];

module.exports = db;
