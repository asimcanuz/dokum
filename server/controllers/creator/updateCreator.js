const db = require("../../models");
const Creator = db.creator;

async function updateCreator(req, res) {
  const { creatorId, creatorName } = req.body;
  const creator = await Creator.update(
    {
      creatorId,
      creatorName,
    },
    {
      where: { creatorId },
    }
  );
  if (!creator) {
    res.status(403).send({ message: "Creator is not found!" });
  }
  res.status(200).send({ message: "Update successfull!" });
}

module.exports = updateCreator;
