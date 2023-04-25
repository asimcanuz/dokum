module.exports = (sequelize, Sequelize) => {
  const Tree = sequelize.define("tree", {
    treeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    active: { type: Sequelize.BOOLEAN },
    date: { type: Sequelize.DATEONLY, defaultValue: Sequelize.NOW },
    listNo: { type: Sequelize.INTEGER },
    treeNo: { type: Sequelize.INTEGER },
    processId: { type: Sequelize.INTEGER },
    isImmediate: { type: Sequelize.BOOLEAN },
    waxWeight: { type: Sequelize.INTEGER },
    mineralWeight: { type: Sequelize.INTEGER },
    processTime: { type: Sequelize.STRING },
    customerQuantity: { type: Sequelize.INTEGER, defaultValue: 0 },
    treeType: { type: Sequelize.STRING },
    finished: { type: Sequelize.BOOLEAN, defaultValue: false },
    createdBy: { type: Sequelize.STRING },
    updatedBy: { type: Sequelize.STRING },
    isOld: { type: Sequelize.BOOLEAN, defaultValue: false },
    desc: { type: Sequelize.TEXT, defaultValue: "" },
  });
  return Tree;
};
