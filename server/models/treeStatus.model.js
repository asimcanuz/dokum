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
    statusCompleteTime: {
      type:Sequelize.TIME,
      defaultValue:'0'
    }
  });
  return TreeStatus;
};
