module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    orderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: Sequelize.INTEGER,
    },
    descriptionId: {
      type: Sequelize.INTEGER,
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
    statusId: { type: Sequelize.INTEGER },
    createdBy: {
      type: Sequelize.INTEGER,
    },
    updatedBy: {
      type: Sequelize.INTEGER,
    },
    isImmediate: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  return Order;
};
