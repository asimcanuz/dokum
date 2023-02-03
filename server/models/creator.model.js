module.exports = (sequelize, Sequelize) => {
  const Creator = sequelize.define("creator", {
    creatorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    creatorName: {
      type: Sequelize.STRING,
    },
  });
  return Creator;
};
