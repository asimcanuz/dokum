const { Sequelize, where, sequelize } = require("sequelize");
const db = require("../../models");
const Op = Sequelize.Op;

const Tree = db.tree;

const getTodayTrees = async (req, res) => {
  const { jobGroupId } = req.query;

  const trees = await Tree.findAll({
    where: {
      active: true,
      finished: false,
      jobGroupId: jobGroupId,

      // today
    },

    include: [
      {
        model: db.jobGroup,
        where: {
          isFinished: false,
        },
      },
      { model: db.wax },
      { model: db.option },
      { model: db.creator },
      { model: db.thick },
      { model: db.color },
      { model: db.treeStatus },
      { model: db.fırın },
      {
        model: db.order,
        include: [{ model: db.customer }, { model: db.description }],
      },
    ],
    order: [["customerQuantity", "DESC"]],
  });

  if (!trees) res.status(401).send({ message: "Trees Not Found!" });
  res.status(200).send({ trees });
};

module.exports = getTodayTrees;
