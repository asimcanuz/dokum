module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customers", {
    customerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    accountNumber: {
      type: Sequelize.STRING,
    },
    customerName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    createdBy: {
      type: Sequelize.INTEGER,
    },
    updatedBy: {
      type: Sequelize.INTEGER,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
    },
  });
  return Customer;
};
