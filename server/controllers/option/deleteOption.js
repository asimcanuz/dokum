const db = require("../../models");
const Option = db.option;

async function deleteOption(req, res) {
  const { optionId } = req.body;

  if (!optionId) {
    res.status(401).send({ message: "Option id not found!" });
  }

  await Option.destroy({
    where: { optionId },
  })
    .then((option) => {
      res.status(200).send({ message: "Option deleted successfull" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

module.exports = deleteOption;
