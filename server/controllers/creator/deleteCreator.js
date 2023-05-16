const db = require("../../models");
const Creator = db.creator;

async function deleteCreator(req, res) {
  const { creatorId } = req.body;
  if (!creatorId) {
    res.status(401).send({ message: "Creator id not found!" });
  }
  await Creator.update(
    { isDeleted: true },
    {
      where: { creatorId },
    }
  )
    .then((creator) => {
      res.status(200).send({ message: "Creator deleted successfull" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

module.exports = deleteCreator;
