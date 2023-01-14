// TODO: env.development ve env.production dosyalarını oluştur
// TODO: proje'nin durumuna .env dosyasına verilerini getir ve onları kullan
// TODO : REFERENCE : https://nodejs.dev/en/learn/nodejs-the-difference-between-development-and-production/
module.exports = {
  HOST: "localhost",
  DATABASE: "dokum",
  USER: "root",
  PASSWORD: "130119",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
