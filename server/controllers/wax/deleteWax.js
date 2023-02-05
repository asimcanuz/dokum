const db = require("../../models");
const Wax = db.wax;

async function deleteWax(req, res) {
  const { waxId } = req.body;
  console.log(waxId);

  if (!waxId) {
    res.status(401).send({ message: "Wax id not found!" });
  }

  await Wax.destroy({
    where: { waxId },
  })
    .then((wax) => {
      res.status(200).send({ message: "Wax deleted successfull" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

module.exports = deleteWax;
