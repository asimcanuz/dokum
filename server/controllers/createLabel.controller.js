const { Sequelize, where } = require("sequelize");
const db = require("../models");

const Op = Sequelize.Op;

const Tree = db.tree;
const Order = db.order;
const Customer = db.customer;
const Option = db.option;
const Color = db.color;

const createLabel = async (req, res) => {
  const { jobGroupId } = req.query;

  // ağaçları renklere göre grupla, gruplanları ayara göre grupla, gruplanları kişiye göre grupla
  const _trees = await Tree.findAll({
    where: {
      active: true,
      finished: false,
      jobGroupId,
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
        // order: [["option.optionText", "ASC"]],
        include: [
          {
            model: db.option,
            order: [["optionText", "ASC"]],
          },
          { model: db.color },
        ],
      },
    ],
  });
  //order'ları ağaçların numarasına göre sırala
  orders.sort((a, b) => a.tree.option.optionText - b.tree.option.optionText);

  // orderları müşterilere göre grupla
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

  // ordersByCustomer'ı renge göre grupla
  for (const customer in ordersByCustomer) {
    for (const option in ordersByCustomer[customer]) {
      ordersByCustomer[customer][option] = ordersByCustomer[customer][
        option
      ].reduce((acc, order) => {
        const { colorId } = order.tree;
        if (!acc["color" + colorId]) {
          acc["color" + colorId] = [];
        }

        acc["color" + colorId].push(order);
        return acc;
      }, {});
    }
  }

  // ordersByCustomer'a ağaç numaralarını ekle
  for (const customer in ordersByCustomer) {
    for (const option in ordersByCustomer[customer]) {
      for (const color in ordersByCustomer[customer][option]) {
        ordersByCustomer[customer][option][color] = ordersByCustomer[customer][
          option
        ][color].reduce((acc, order) => {
          const { treeNo } = order.tree;
          console.log(treeNo);
          if (acc.includes(treeNo) === false) {
            acc.push(treeNo);
          }
          return acc;
        }, []);
      }
    }
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
      for (const color in ordersByCustomer[_customer.customerName][
        _option.optionText
      ]) {
        const _color = await Color.findOne({
          where: {
            colorId: color.replace("color", ""),
          },
        });
        ordersByCustomer[_customer.customerName][_option.optionText][
          _color.colorName
        ] = ordersByCustomer[_customer.customerName][_option.optionText][color];
        delete ordersByCustomer[_customer.customerName][_option.optionText][
          color
        ];
      }
    }
  }

  if (!_trees) {
    return res.status(404).send({ message: "No trees found" });
  }
  res.status(200).send({ ordersByCustomer });
};

module.exports = createLabel;
