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
    dialectOptions: {
      useUTC: false,
    },
    timezone: "+03:00",
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
db.treeStatusDate = require("./treeStatusDate.model")(sequelize, Sequelize);
db.jobGroup = require("./jobGroup.model")(sequelize, Sequelize);

// user role 1-1
db.role.hasOne(db.user);
db.user.belongsTo(db.role);

//customer tree n-n
db.customer.belongsToMany(db.tree, { through: "customerTrees" });
db.tree.belongsToMany(db.customer, { through: "customerTrees" });

// tree 1-1
db.option.hasOne(db.tree, {
  foreignKey: "optionId",
});
db.creator.hasOne(db.tree, {
  foreignKey: "creatorId",
});
db.treeStatus.hasOne(db.tree, {
  foreignKey: "treeStatusId",
});
db.thick.hasOne(db.tree, {
  foreignKey: "thickId",
});
db.wax.hasOne(db.tree, {
  foreignKey: "waxId",
});
db.color.hasOne(db.tree, {
  foreignKey: "colorId",
});

db.jobGroup.hasOne(db.tree, {
  foreignKey: "jobGroupId",
});

db.tree.belongsTo(db.jobGroup, {
  foreignKey: "jobGroupId",
});
db.tree.belongsTo(db.option, {
  foreignKey: "optionId",
});
db.tree.belongsTo(db.creator, {
  foreignKey: "creatorId",
});
db.tree.belongsTo(db.treeStatus, {
  foreignKey: "treeStatusId",
});
db.tree.belongsTo(db.thick, {
  foreignKey: "treeStatusId",
});
db.tree.belongsTo(db.wax, {
  foreignKey: "waxId",
});
db.tree.belongsTo(db.color, {
  foreignKey: "colorId",
});

// tree - order 1-n
db.tree.hasMany(db.order);
db.order.belongsTo(db.tree, {
  foreignKey: "treeId",
  as: "tree",
});

//  order 1-1

db.creator.hasOne(db.order, {
  foreignKey: "createdBy",
});
db.creator.hasOne(db.order, {
  foreignKey: "updatedBy",
});
db.customer.hasOne(db.order, {
  foreignKey: "customerId",
});
db.description.hasOne(db.order, {
  foreignKey: "descriptionId",
});
db.treeStatus.hasOne(db.order, {
  foreignKey: "statusId",
});

db.order.belongsTo(db.creator, {
  foreignKey: "createdBy",
});
db.order.belongsTo(db.creator, {
  foreignKey: "updatedBy",
});
db.order.belongsTo(db.customer, {
  foreignKey: "customerId",
});
db.order.belongsTo(db.description, {
  foreignKey: "descriptionId",
});
db.order.belongsTo(db.treeStatus, {
  foreignKey: "statusId",
});

db.ROLES = ["user", "superuser", "admin"];

module.exports = db;
