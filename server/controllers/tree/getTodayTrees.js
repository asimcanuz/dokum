const { Sequelize } = require("sequelize");
const db = require("../../models");
const moment = require("moment/moment");
const Op = Sequelize.Op;

const Tree = db.tree;
const TODAY = moment().format("YYYY-MM-DD");

const getTodayTrees = async (req, res) => {
  console.log(TODAY);
  const trees = await Tree.findAll({
    where: {
      date: {
        [Op.eq]: TODAY,
      },
      active: true,
    },
    include: [
      { model: db.wax },
      { model: db.option },
      { model: db.creator },
      { model: db.creator },
      { model: db.thick },
      { model: db.color },
      { model: db.treeStatus },
      { model: db.order },
    ],
  });

  if (!trees) res.status(401).send({ message: "Trees Not Found!" });
  res.status(200).send({ trees });
};

module.exports = getTodayTrees;
