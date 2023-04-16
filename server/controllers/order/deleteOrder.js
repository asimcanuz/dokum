const db = require("../../models");
const Order = db.order;

const deleteOrder = async (req, res) => {
  const { orderId } = req.body;

  const treeId = await Order.findOne({
    where: {
      orderId,
    },
    fields: ["treeId"],
  })
    .then(async (result) => {
      const treeId = result.treeId;
      await Order.destroy({
        where: {
          orderId: orderId,
        },
      });

      const orders = await Order.findAll({
        where: {
          treeId,
        },
        include: [{ model: db.customer }],
      });

      const customers = [];
      orders.forEach((order) => {
        if (!customers.includes(order.customer.customerName)) {
          customers.push(order.customer.customerName);
        }
      });
      if (customers.length > 1) {
        await db.tree.update(
          {
            treeType: "Karışık",
            customerQuantity: customers.length,
          },
          {
            where: {
              treeId,
            },
          }
        );
      } else {
        await db.tree.update(
          {
            treeType: customers[0],
            customerQuantity: customers.length,
          },
          {
            where: {
              treeId,
            },
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });

  res.status(200).json({ message: "Order deleted successfully" });
};

module.exports = deleteOrder;
