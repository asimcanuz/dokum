module.exports = (sequelize, Sequelize) => {
  const Description = sequelize.define("description", {
    descriptionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    descriptionText: {
      type: Sequelize.STRING,
    },
  });
  return Description;
};
