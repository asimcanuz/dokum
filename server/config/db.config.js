// TODO: env.development ve env.production dosyalarını oluştur
// TODO: proje'nin durumuna .env dosyasına verilerini getir ve onları kullan
// TODO : REFERENCE : https://nodejs.dev/en/learn/nodejs-the-difference-between-development-and-production/

require("dotenv").config();
module.exports = {
  HOST: process.env.HOST,
  DATABASE: process.env.DATABASE,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
