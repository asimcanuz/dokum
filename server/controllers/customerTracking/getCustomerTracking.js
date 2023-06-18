const { Sequelize, where } = require("sequelize");
const db = require("../../models");

const Op = Sequelize.Op;

const Tree = db.tree;
const Order = db.order;
const Customer = db.customer;
const Option = db.option;
const Color = db.color;

const getCustomerTracking = async (req, res) => {
  const { jobGroupId } = req.query;

  const _trees = await Tree.findAll({
    where: {
      active: true,
      finished: false,
      jobGroupId: jobGroupId,
    },
  });

  const orders = await Order.findAll({
    where: {
      treeId: {
        [Op.in]: _trees.map((tree) => tree.treeId),
      },
      treeTreeId: {
        [Op.in]: _trees.map((tree) => tree.treeId),
      },
    },
    include: [
      { model: db.customer },
      {
        model: db.tree,
        where: {
          active: true,
          finished: false,
        },
        as: "tree",
        include: [
          { model: db.option },
          { model: db.color },
          { model: db.treeStatus },
        ],
      },
    ],
  });

  // orderları müşteri göre grupla
  const ordersByCustomer = orders.reduce((acc, order) => {
    const { customerId } = order;

    if (!acc["customer" + customerId]) {
      acc["customer" + customerId] = [];
    }
    acc["customer" + customerId].push(order);
    return acc;
  }, {});

  // ordersByCustomer'ı ayara göre grupla
  for (const customer in ordersByCustomer) {
    ordersByCustomer[customer] = ordersByCustomer[customer].reduce(
      (acc, order) => {
        const { optionId } = order.tree;
        if (!acc["option" + optionId]) {
          acc["option" + optionId] = [];
        }
        acc["option" + optionId].push(order);
        return acc;
      },
      {}
    );
  }

  // grupların keylerinin isimleri ile değiştir
  for (const customer in ordersByCustomer) {
    const _customer = await Customer.findOne({
      where: {
        customerId: customer.replace("customer", ""),
      },
    });
    ordersByCustomer[_customer.customerName] = ordersByCustomer[customer];
    delete ordersByCustomer[customer];
    for (const option in ordersByCustomer[_customer.customerName]) {
      const _option = await Option.findOne({
        where: {
          optionId: option.replace("option", ""),
        },
      });
      ordersByCustomer[_customer.customerName][_option.optionText] =
        ordersByCustomer[_customer.customerName][option];
      delete ordersByCustomer[_customer.customerName][option];
    }
  }
  if (!_trees) {
    return res.status(404).send({ message: "No trees found" });
  }
  res.status(200).send({ ordersByCustomer });
};

module.exports = getCustomerTracking;
