const db = require("../../models");
const TreeStatus = db.treeStatus;

async function deleteTreeStatus(req, res) {
  const { treeStatusId } = req.body;

  if (!treeStatusId) {
    res.status(401).send({ message: "Tree Status id not found!" });
  }

  await TreeStatus.destroy({
    where: { treeStatusId },
  })
    .then((treeStatus) => {
      res.status(200).send({ message: "Thick deleted successfull" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

module.exports = deleteTreeStatus;
