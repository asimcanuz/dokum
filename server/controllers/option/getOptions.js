const db = require("../../models");
const Option = db.option;

async function getOptions(req, res) {
  const options = await Option.findAll({
    attributes: ["optionId", "optionText"],
  });

  if (!options) {
    res.status(401).send({ message: "Options Not Found!" });
  }
  res.status(200).send({ options });
}

module.exports = getOptions;
