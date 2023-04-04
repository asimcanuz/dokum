module.exports = (sequelize, Sequelize) => {
  const TreeStatusDate = sequelize.define("treeStatusDate", {
    treeStatusDateId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    treeId: {
      type: Sequelize.STRING,
    },
    treeStatusDate: {
      type: Sequelize.DATE,
    },
    oldTreeStatusId: {
      type: Sequelize.STRING,
    },
    newTreeStatusId: {
      type: Sequelize.STRING,
    },
    updateBy: {
      type: Sequelize.STRING,
    },
  });
  return TreeStatusDate;
};
