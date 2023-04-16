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
    .then(async (createdOrder) => {
      // müşteri adet ve ağaç tipi bilgilerini güncelle

      const orders = await Order.findAll({
        where: {
          treeId,
        },
        include: [{ model: db.customer }],
      });
      console.log(orders);

      // farklı customer'ların sayısını hesapla ve
      // farklı müşterilerin sayısı birden fazla ise ağaç tipi karışık olarak değilse müşteri adı ile güncelle
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
      }

      res.status(200).send({ createdOrder });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = addOrder;
