module.exports = (sequelize, Sequelize) => {
  const Color = sequelize.define("color", {
    colorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    colorName: {
      type: Sequelize.STRING,
    },
  });
  return Color;
};
