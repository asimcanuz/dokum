const db = require("../../models");
const Wax = db.wax;

async function updateWax(req, res) {
  const { waxId, waxName } = req.body;
  const wax = await Wax.update(
    {
      waxId,
      waxName,
    },
    {
      where: { waxId },
    }
  );
  if (!wax) {
    res.status(403).send({ message: "Wax is not found!" });
  }
  res.status(200).send({ message: "Update successfull!" });
}

module.exports = updateWax;
