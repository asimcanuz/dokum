const db = require("../../models");
const Color = db.color;

function addColor(req, res) {
  const { colorName } = req.body;

  Color.create({
    colorName,
  })
    .then((color) => {
      res.status(200).send({ color });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

module.exports = addColor;
