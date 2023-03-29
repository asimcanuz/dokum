const db = require("../../models");
const Order = db.order;

const deleteOrder = async (req, res) => {
  const { orderId } = req.body;
  await Order.destroy({
    where: {
      orderId: orderId,
    },
  });
  res.status(200).json({ message: "Order deleted successfully" });
};

module.exports = deleteOrder;
