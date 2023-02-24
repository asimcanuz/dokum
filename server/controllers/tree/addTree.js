const db = require("../../models");
const Tree = db.tree;

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
    isImmediate,
    active,
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
    isImmediate,
    active,
  })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports = addTree;
