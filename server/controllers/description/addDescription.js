const db = require("../../models");
const Description = db.description;

function addDescription(req, res) {
  const { descriptionText } = req.body;

  Description.create({
    descriptionText,
  })
    .then((description) => {
      res.status(200).send({ description });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

module.exports = addDescription;
