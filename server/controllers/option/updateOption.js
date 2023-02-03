const db = require("../../models");
const Option = db.option;

async function updateOption(req, res) {
  const { optionId, optionText } = req.body;
  const option = await Option.update(
    {
      optionId,
      optionText,
    },
    {
      where: { optionId },
    }
  );
  if (!option) {
    res.status(403).send({ message: "Option is not found!" });
  }
  res.status(200).send({ message: "Update successfull!" });
}

module.exports = updateOption;
