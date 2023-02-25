const db = require("../../models");
const Order = db.order;

const addOrder = async (req, res) => {
  const { treeId, customerId, quantity, descriptionId, createdBy } = req.body;
  await Order.create({
    customerId,
    descriptionId,
    quantity,
    treeId,
    treeTreeId: treeId,
    createdBy,
    updatedBy: createdBy,
    statusId: 1,
  })
    .then((createdOrder) => res.status(200).send({ createdOrder }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = addOrder;
