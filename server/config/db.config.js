const envConfig = require("./env.config");
require("dotenv").config();

module.exports = {
  HOST: envConfig.HOST,
  DATABASE: envConfig.DATABASE,
  USER: envConfig.USER,
  PASSWORD: envConfig.PASSWORD,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
