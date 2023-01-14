module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
    },
    email: {
      type: Sequelize.STRING,
    },
    refreshToken: {
      type: Sequelize.STRING,
    },
  });
  return User;
};
