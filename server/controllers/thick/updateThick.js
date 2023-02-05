const db = require("../../models");
const Thick = db.thick;

async function updateThick(req, res) {
  const { thickId, thickName } = req.body;
  const thick = await Thick.update(
    {
      thickId,
      thickName,
    },
    {
      where: { thickId },
    }
  );
  if (!thick) {
    res.status(403).send({ message: "Thick is not found!" });
  }
  res.status(200).send({ message: "Update successfull!" });
}

module.exports = updateThick;
