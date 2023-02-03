const db = require("../../models");
const Description = db.description;

async function getDescriptions(req, res) {
  const descriptions = await Description.findAll({
    attributes: ["descriptionId", "descriptionText"],
  });

  if (!descriptions) {
    res.status(401).send({ message: "Descriptions Not Found!" });
  }
  res.status(200).send({ descriptions });
}

module.exports = getDescriptions;
