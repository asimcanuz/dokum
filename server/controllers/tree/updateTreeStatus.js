const { Sequelize } = require("sequelize");
const db = require("../../models");
const moment = require("moment/moment");
const Op = Sequelize.Op;

const Tree = db.tree;

const updateTreeStatus = async (req, res) => {
  const { treeStatusId, treeId } = req.body;
  const oldTreeValue = await Tree.findOne({
    where: {
      treeId,
    },
  });
  const oldTreeStatusId = oldTreeValue.treeStatusId;
  if (oldTreeStatusId !== treeStatusId) {
    const treeStatusDate = await db.treeStatusDate.create({
      treeStatusDate: moment(),
      oldTreeStatusId: oldTreeStatusId,
      newTreeStatusId: treeStatusId,
      treeId: treeId,
      // updateBy: req.body.updateBy,
    });
  }

  Tree.update(
    {
      treeStatusId,
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
        message: "Error updating Tree with id=" + body.treeId,
        error: err,
      });
    });
};

module.exports = updateTreeStatus;
