const db = require("../../models");
const TreeStatus = db.treeStatus;

async function getTreeStatuses(req, res) {
  const treeStatuses = await TreeStatus.findAll({
    attributes: ["treeStatusId", "treeStatusName"],
  });

  if (!treeStatuses) {
    res.status(401).send({ message: "Thicks Not Found!" });
  }
  res.status(200).send({ treeStatuses });
}

module.exports = getTreeStatuses;
