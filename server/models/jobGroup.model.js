module.exports = (sequelize, Sequelize) => {
  const JobGroup = sequelize.define("jobGroup", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.NOW,
    },
    number: {
      type: Sequelize.STRING,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isFinished: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    erkenFırınGrubuOlusturulduMu: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  return JobGroup;
};
