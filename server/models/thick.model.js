module.exports = (sequelize, Sequelize) => {
  const Thick = sequelize.define("thick", {
    thickId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    thickName: {
      type: Sequelize.STRING,
    },
  });
  return Thick;
};
