module.exports = (sequelize, Sequelize) => {
  const Tree = sequelize.define("tree", {
    treeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    // optionId: { type: Sequelize.INTEGER },
    // waxId: { type: Sequelize.INTEGER },
    // creatorId: { type: Sequelize.INTEGER },
    // thickId: { type: Sequelize.INTEGER },
    // colorId: { type: Sequelize.INTEGER },
    // treeStatusId: { type: Sequelize.INTEGER },
    active: { type: Sequelize.BOOLEAN },
    date: { type: Sequelize.DATEONLY, defaultValue: Sequelize.NOW },
    // registerId: { type: Sequelize.INTEGER },
    listNo: { type: Sequelize.INTEGER },
    treeNo: { type: Sequelize.INTEGER },
    processId: { type: Sequelize.INTEGER },
    isImmediate: { type: Sequelize.BOOLEAN },
    waxWeight: { type: Sequelize.INTEGER },
    mineralWeight: { type: Sequelize.INTEGER },
    processTime: { type: Sequelize.STRING },
    createdBy: { type: Sequelize.STRING },
    updatedBy: { type: Sequelize.STRING },
  });
  return Tree;
};
