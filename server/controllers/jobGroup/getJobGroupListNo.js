const { Sequelize } = require("sequelize");
const db = require("../../models");
const Op = Sequelize.Op;

const Tree = db.tree;

const getJobGroupListNo = async (req, res) => {
  const { jobGroupId } = req.query;

  const trees = await Tree.findAll({
    where: {
      active: true,
      finished: false,
      jobGroupId: jobGroupId,
    },
  });

  let treeNoList = trees.map((tree) => tree.treeNo);

  if (!trees) res.status(401).send({ message: "Trees Not Found!" });
  return res.status(200).send(treeNoList);
};

module.exports = getJobGroupListNo;
