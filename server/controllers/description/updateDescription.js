const db = require("../../models");
const Description = db.description;

async function updateDescription(req, res) {
  const { descriptionId, descriptionText } = req.body;
  const description = await Description.update(
    {
      descriptionId,
      descriptionText,
    },
    {
      where: { descriptionId },
    }
  );
  if (!description) {
    res.status(403).send({ message: "Description is not found!" });
  }
  res.status(200).send({ message: "Update successfull!" });
}

module.exports = updateDescription;
