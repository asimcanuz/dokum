module.exports = (sequelize, Sequelize) => {
  const Wax = sequelize.define("wax", {
    waxId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    waxName: {
      type: Sequelize.STRING,
    },
  });
  return Wax;
};
