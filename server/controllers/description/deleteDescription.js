const db = require("../../models");
const Description = db.description;

async function deleteDescription(req, res) {
  const { descriptionId } = req.body;
  if (!descriptionId) {
    res.status(401).send({ message: "Description id not found!" });
  }
  await Description.destroy({
    where: { descriptionId },
  })
    .then((description) => {
      res.status(200).send({ message: "Description deleted successfull" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

module.exports = deleteDescription;
