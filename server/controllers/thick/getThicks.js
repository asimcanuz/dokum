const db = require("../../models");
const Thick = db.thick;

async function getThicks(req, res) {
  const thicks = await Thick.findAll({
    attributes: ["thickId", "thickName"],
  });

  if (!thicks) {
    res.status(401).send({ message: "Thicks Not Found!" });
  }
  res.status(200).send({ thicks });
}

module.exports = getThicks;
