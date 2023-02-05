const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve("./env", `${process.env.NODE_ENV}.env`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  HOST: process.env.HOST,
  DATABASE: process.env.DATABASE,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  ADMINPASS: process.env.ADMINPASS,
  PORT: process.env.PORT,
};
