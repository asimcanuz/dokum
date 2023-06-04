module.exports = (sequelize, Sequelize) => {
  const Fırın = sequelize.define("fırın", {
    fırınId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    fırınSıra: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    fırınKonum: {
      type: Sequelize.STRING,
    },
  });
  return Fırın;
};
