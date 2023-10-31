const moment = require("moment");
const db = require("../../models");
const Order = db.order;

const getOrders = async (req, res) => {
  // bağlı olduğu ağaç active false ise getirme
  // pagination yapılacak
  // const { page, size } = req.query;
  // const { limit, offset } = getPagination(page, size);

  const orders = await Order.findAndCountAll({
    // limit,
    // offset,
    include: [
      {
        model: db.tree,
        as: "tree",
        where: {
          active: true,
        },
        include: [
          { model: db.wax },
          { model: db.option },
          { model: db.creator },
          { model: db.thick },
          { model: db.color },
          { model: db.treeStatus },
          { model: db.jobGroup },
        ],
      },
      {
        model: db.customer,
      },
    ],
  });

  if (!orders) res.status(401).send({ message: "Orders Not Found!" });
  res.status(200).send({ orders });
};

module.exports = getOrders;
