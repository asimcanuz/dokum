module.exports = (sequelize, Sequelize) => {
  const TreeStatus = sequelize.define("treeStatus", {
    treeStatusId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    treeStatusName: {
      type: Sequelize.STRING,
    },
  });
  return TreeStatus;
};
