const { Sequelize, where } = require("sequelize");
const db = require("../../models");
const Op = Sequelize.Op;

const Tree = db.tree;

const getTodayTreesIndexes = async (req, res) => {
  const { jobGroupId } = req.query;

  const trees = await Tree.findAll({
    where: {
      active: true,
      finished: false,
      jobGroupId: jobGroupId,

      // today
    },
    attributes: ["treeNo", "listNo", "treeId"],
  });

  if (!trees) res.status(401).send({ message: "Trees Not Found!" });
  res.status(200).send({ trees });
};

module.exports = getTodayTreesIndexes;
