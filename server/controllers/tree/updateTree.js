const { Sequelize } = require("sequelize");
const db = require("../../models");
const moment = require("moment/moment");
const Op = Sequelize.Op;

const Tree = db.tree;

const updateTree = async (req, res) => {
  // const {
  //   active,
  //   colorId,
  //   creatorId,
  //   date,
  //   isImmediate,
  //   listNo,
  //   optionId,
  //   processId,
  //   thickId,
  //   treeNo,
  //   treeStatusId,
  //   waxId,
  // }

  if (req.body.treeStatusId) {
    const { treeStatusId, treeId } = req.body;
    const oldTreeValue = await Tree.findOne({
      where: {
        treeId,
      },
    });
    const oldTreeStatusId = oldTreeValue.treeStatusId;
    if (oldTreeStatusId !== treeStatusId) {
      const treeStatusDate = await db.treeStatusDate.create({
        treeStatusDate: moment().format("YYYY-MM-DD"),
        oldTreeStatusId: oldTreeStatusId,
        newTreeStatusId: treeStatusId,
        treeId: treeId,
        // updateBy: req.body.updateBy,
      });
    }
  }
  const body = req.body;
  Tree.update(body, {
    where: {
      treeId: body.treeId,
    },
  })
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

module.exports = updateTree;
