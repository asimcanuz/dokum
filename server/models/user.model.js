module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("Users", {
    UserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    Username: {
      type: Sequelize.STRING,
    },
    UserRoleId: {
      type: Sequelize.INTEGER,
    },
    Password: {
      type: Sequelize.STRING,
    },
    UserSettingId: {
      type: Sequelize.STRING,
    },
    IsActive: {
      type: Sequelize.BOOLEAN,
    },
    Email: {
      type: Sequelize.STRING,
    },
    AuthToken: {
      type: Sequelize.STRING,
    },
  });
};
