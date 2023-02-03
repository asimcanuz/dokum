const db = require("../../models");
const Color = db.color;

async function deleteColor(req, res) {
  const { colorId } = req.body;
  if (!colorId) {
    res.status(401).send({ message: "Color id not found!" });
  }
  await Color.destroy({
    where: { colorId },
  })
    .then((color) => {
      res.status(200).send({ message: "Color deleted successfull" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

module.exports = deleteColor;
