const db = require("../../models");
const Creator = db.creator;

function addCreator(req, res) {
  const { creatorName } = req.body;

  Creator.create({
    creatorName,
  })
    .then((creator) => {
      res.status(200).send({ creator });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

module.exports = addCreator;
