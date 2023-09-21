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
  dialectOptions: {
    useUTC: false, //for reading from database
    dateStrings: true,
    typeCast: function (field, next) { // for reading from database
      if (field.type === 'DATETIME') {
        return field.string()
      }
      return next()
    },
  },

  timezone: '+03:00', // for writing to data
};
