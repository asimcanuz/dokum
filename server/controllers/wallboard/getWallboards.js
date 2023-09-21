const db = require("../../models");
const { Sequelize, where, sequelize } = require("sequelize");

const Tree = db.tree;
async function getWallboards(req, res) {
   const { jobGroupId } = req.query;

  let trees = await Tree.findAll({
    where: {
      active: true,
      finished: false,
      jobGroupId: jobGroupId,
    },

    include: [
      { model: db.option },
      { model: db.color },
      { model: db.treeStatus },
    ],
    order: [["isImmediate", "DESC"]],
  });

  let treeStatusDate = [];
  for (let index = 0; index < trees.length; index++) {
    const tree = trees[index];
    let treeStatuses = await db.treeStatusDate.findAll({
      where: { treeId: tree.treeId },
      order: [["treeStatusDate", "DESC"]],
    });

    trees[index]["treeStatuses"] = treeStatuses[0];
    treeStatusDate.push(treeStatuses[0]);
  }
  

  if (!trees) res.status(401).send({ message: "Trees Not Found!" });
  res.status(200).send({ trees, treeStatusDate });
}

module.exports = getWallboards;
