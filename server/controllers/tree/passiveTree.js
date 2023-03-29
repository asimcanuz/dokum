const { Sequelize } = require("sequelize");
const db = require("../../models");
const Op = Sequelize.Op;

const Tree = db.tree;

const passiveTree = async (req, res) => {
  const { treeId } = req.body;
  Tree.update(
    {
      active: false,
      finished: true,
    },
    {
      where: {
        treeId,
      },
    }
  )
    .then((result) => {
      res.status(200).send({
        message: "Tree updated successfully!",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tree with id=" + treeId,
        error: err,
      });
    });
};

module.exports = passiveTree;
