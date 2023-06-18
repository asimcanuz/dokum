const db = require("../../models");
const Tree = db.tree;
const moment = require("moment/moment");

const addTree = (req, res) => {
  const {
    optionId,
    waxId,
    creatorId,
    thickId,
    colorId,
    date,
    listNo,
    treeNo,
    treeStatusId,
    active,
    jobGroupId,
    desc,
  } = req.body;

  Tree.create({
    optionId,
    waxId,
    creatorId,
    thickId,
    colorId,
    date,
    listNo,
    treeNo,
    treeStatusId,
    active,
    jobGroupId,
    desc,
  })
    .then(async (result) => {
      await db.treeStatusDate.create({
        treeStatusDate: moment().format("YYYY-MM-DD"),
        oldTreeStatusId: treeStatusId,
        newTreeStatusId: treeStatusId,
        treeId: result.treeId,
        // updateBy: req.body.updateBy,
      });
      await res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err.message });
    });
};

module.exports = addTree;
