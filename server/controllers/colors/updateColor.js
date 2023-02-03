const db = require("../../models");
const Color = db.color;

async function updateColor(req, res) {
  const { colorId, colorName } = req.body;
  const color = await Color.update(
    {
      colorId,
      colorName,
    },
    {
      where: { colorId },
    }
  );
  if (!color) {
    res.status(403).send({ message: "Color is not found!" });
  }
  res.status(200).send({ message: "Update successfull!" });
}

module.exports = updateColor;
