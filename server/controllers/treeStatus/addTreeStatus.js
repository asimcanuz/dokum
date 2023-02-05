const db = require("../../models");
const TreeStatus = db.treeStatus;

const addTreeStatus = (req, res) => {
  const { treeStatusName } = req.body;

  TreeStatus.create({ treeStatusName })
    .then((treeStatus) => res.status(200).send({ treeStatus }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = addTreeStatus;
