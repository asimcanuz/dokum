const db = require("../../models");
const TreeStatus = db.treeStatus;

async function updateTreeStatus(req, res) {
  const { treeStatusId, treeStatusName } = req.body;
  const treeStatus = await TreeStatus.update(
    {
      treeStatusId,
      treeStatusName,
    },
    {
      where: { treeStatusId },
    }
  );
  if (!treeStatus) {
    res.status(403).send({ message: "Tree status is not found!" });
  }
  res.status(200).send({ message: "Update successfull!" });
}

module.exports = updateTreeStatus;
