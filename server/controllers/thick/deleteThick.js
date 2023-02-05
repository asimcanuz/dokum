const db = require("../../models");
const Thick = db.thick;

async function deleteThick(req, res) {
  const { thickId } = req.body;

  if (!thickId) {
    res.status(401).send({ message: "Thick id not found!" });
  }

  await Thick.destroy({
    where: { thickId },
  })
    .then((thick) => {
      res.status(200).send({ message: "Thick deleted successfull" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

module.exports = deleteThick;
