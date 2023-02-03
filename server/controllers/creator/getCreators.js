const db = require("../../models");
const Creator = db.creator;

async function getCreators(req, res) {
  const creators = await Creator.findAll({
    attributes: ["creatorId", "creatorName"],
  });

  if (!creators) {
    res.status(401).send({ message: "Creators Not Found!" });
  }
  res.status(200).send({ creators });
}

module.exports = getCreators;
