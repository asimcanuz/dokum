const db = require("../../models");
const Color = db.color;

async function getColors(req, res) {
  const colors = await Color.findAll({
    attributes: ["colorId", "colorName"],
  });

  if (!colors) {
    res.status(401).send({ message: "Colors Not Found!" });
  }
  res.status(200).send({ colors });
}

module.exports = getColors;
