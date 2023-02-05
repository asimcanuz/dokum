const db = require("../../models");
const Thick = db.thick;

const addThick = (req, res) => {
  const { thickName } = req.body;

  Thick.create({ thickName })
    .then((thick) => res.status(200).send({ thick }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = addThick;
