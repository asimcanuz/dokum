const db = require("../../models");
const Tree = db.tree;

const getTrees = async (req, res) => {
  const trees = await Tree.findAll({
    include: [
      { model: db.wax },
      { model: db.option },
      { model: db.creator },
      { model: db.creator },
      { model: db.thick },
      { model: db.color },
      { model: db.treeStatus },
      { model: db.jobGroup },
      {
        model: db.order,
        include: [{ model: db.customer }, { model: db.description }],
      },
    ],
  });
  if (!trees) res.status(401).send({ message: "Trees Not Found!" });
  res.status(200).send({ trees });
};

module.exports = getTrees;
