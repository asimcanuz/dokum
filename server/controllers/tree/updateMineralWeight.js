const { Sequelize } = require("sequelize");
const db = require("../../models");
const moment = require("moment/moment");
const Op = Sequelize.Op;

const Tree = db.tree;

const updateMineralWeight = async (req, res) => {
  const { mineralWeight, treeId, waxWeight } = req.body;
  const tree = await Tree.findOne({
    where: {
      treeId,
    },
  });
  const oldMineralWeight = tree.mineralWeight;
  const oldWaxWeight = tree.waxWeight;
  if (mineralWeight !== oldMineralWeight || oldWaxWeight !== waxWeight) {
    // update
    Tree.update(
      { mineralWeight, waxWeight },
      {
        where: {
          treeId,
        },
      }
    );
  }

  res.status(200).send({ message: "Tree updated successfully!" });
};

module.exports = updateMineralWeight;
