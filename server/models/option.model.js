module.exports = (sequelize, Sequelize) => {
  const Option = sequelize.define("option", {
    optionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    optionText: {
      type: Sequelize.STRING,
    },
  });
  return Option;
};
