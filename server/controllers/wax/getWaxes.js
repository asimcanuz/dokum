const db = require("../../models");
const Wax = db.wax;

async function getWaxes(req, res) {
  const waxes = await Wax.findAll({
    attributes: ["waxId", "waxName"],
  });

  if (!waxes) {
    res.status(401).send({ message: "Waxes Not Found!" });
  }
  res.status(200).send({ waxes });
}

module.exports = getWaxes;
