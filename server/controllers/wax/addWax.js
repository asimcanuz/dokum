const db = require("../../models");
const Wax = db.wax;

const addWax = (req, res) => {
  const { waxName } = req.body;

  Wax.create({ waxName })
    .then((wax) => res.status(200).send({ wax }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = addWax;
