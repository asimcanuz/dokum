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
        as:'color'
        
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
      ["color","colorName", "ASC"],
    ],
    raw: true,
  });

  res.status(200).send({ musteriAdetSiraliMadenAyarlamaRaporu });
};


module.exports = musteriAdetSiraliMadenAyarlamaRaporu;
