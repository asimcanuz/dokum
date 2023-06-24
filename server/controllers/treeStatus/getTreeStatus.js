const db = require("../../models");
const TreeStatus = db.treeStatus;

async function getTreeStatuses(req, res) {
  const treeStatuses = await TreeStatus.findAll({
    attributes: ["treeStatusId", "treeStatusName", "statusCompleteTime"],
  });

  if (!treeStatuses) {
    res.status(401).send({ message: "Ağaç Durumu bulunamadı" });
  }
  res.status(200).send({ treeStatuses });
}

module.exports = getTreeStatuses;
