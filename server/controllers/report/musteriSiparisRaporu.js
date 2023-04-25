const db = require("../../models");

const musteriSiparisRaporu = async (req, res) => {
  const { customer, minDate, maxDate } = req.query;

  const musteriSiparis = await db.tree.findAll({
    raw: true,
    attributes: ["treeId", "active", "treeNo", "listNo"],
    include: [
      {
        model: db.jobGroup,
        attributes: ["date"],
        where: {
          isDeleted: false,
          date: {
            [db.Sequelize.Op.between]: [minDate, maxDate],
          },
        },
      },
      {
        model: db.order,
        attributes: ["orderId", "quantity"],
        where: {
          customerId: customer,
        },
        include: [
          {
            model: db.customer,
            attributes: ["customerName"],
            paranoid: false,
          },
        ],
      },
      {
        model: db.option,
        attributes: ["optionText"],
        paranoid: false,
      },
      {
        model: db.color,
        attributes: ["colorName"],
        paranoid: false,
      },
      {
        model: db.thick,
        attributes: ["thickName"],
        paranoid: false,
      },
      {
        model: db.treeStatus,
        attributes: ["treeStatusName"],
        paranoid: false,
      },
    ],
  });

  res.status(200).send({ musteriSiparis });
};

module.exports = musteriSiparisRaporu;
