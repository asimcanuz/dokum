const db = require("../../models");
const Option = db.option;

function addOption(req, res) {
  const { optionText } = req.body;

  Option.create({
    optionText,
  })
    .then((options) => {
      res.status(200).send({ options });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
}

module.exports = addOption;
