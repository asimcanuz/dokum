const db = require("../../models");

const madenAyarlamaRaporu = async (req, res) => {
  const { jobGroupId } = req.query;

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
      ["treeNo", "ASC"],
    ],
    raw: true,
  });

  res.status(200).send({ madenAyarlamaRaporu });
};

module.exports = madenAyarlamaRaporu;
