const db = require("../../models");
const Order = db.order;

const madenAyarlamaRaporu = async (req, res) => {
  const { jobGroupId } = req.query;
  //   select t.treeNo,t.treeType,t.customerQuantity, opts.optionText,th.thickName,c.colorName,t.waxWeight,t.mineralWeight from trees t
  // left join jobgroups j on  j.isDeleted=false and j.isFinished=false and j.id = t.jobGroupId
  // left join options opts ON opts.optionId = t.optionId
  // left join colors c on c.colorId=t.colorId
  // left join thicks th on th.thickId=t.thickId
  // where t.finished=false and j.isDeleted=false and j.isFinished=false
  // order by opts.optionId asc,t.treeNo ASC

  // let minDate = "";
  // let maxDate = "";

  // if (req.query.maxDate) {
  //   maxDate = req.query.maxDate;
  // }
  // if (req.query.minDate) {
  //   minDate = req.query.minDate;
  // }

  const madenAyarlamaRaporu = await db.tree.findAll({
    where: {
      finished: false,
      jobGroupId,
    },
    attributes: [
      "treeNo",
      "treeType",
      "customerQuantity",
      "waxWeight",
      "mineralWeight",
    ],
    include: [
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
    ],
    order: [
      ["optionId", "ASC"],
      ["treeNo", "ASC"],
    ],
    raw: true,
  });

  res.status(200).send({ madenAyarlamaRaporu });
};

module.exports = madenAyarlamaRaporu;
