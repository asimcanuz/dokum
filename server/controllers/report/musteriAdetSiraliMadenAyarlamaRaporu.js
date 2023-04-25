// select t.treeNo, opts.optionText, opts.optionId, c.colorName, c.colorId ,t.customerQuantity from trees t
// left join options opts ON opts.optionId = t.optionId
// left join jobgroups j on j.isDeleted=false and j.isFinished=false and j.id=t.jobGroupId
// left join colors c on c.colorId = t.colorId
// where t.finished=false
// order by opts.optionId asc,t.customerQuantity DESC,t.treeNo ASC,c.colorName ASC
const db = require("../../models");

const musteriAdetSiraliMadenAyarlamaRaporu = async (req, res) => {
  const { jobGroupId } = req.query;

  const musteriAdetSiraliMadenAyarlamaRaporu = await db.tree.findAll({
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
      "isImmediate",
      "isOld",
      "desc",
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
      ["customerQuantity", "DESC"],
      ["treeNo", "ASC"],
      ["colorId", "ASC"],
    ],
    raw: true,
  });

  res.status(200).send({ musteriAdetSiraliMadenAyarlamaRaporu });
};

module.exports = musteriAdetSiraliMadenAyarlamaRaporu;
