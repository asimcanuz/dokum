const { Sequelize } = require("sequelize");
const db = require("../../models");
const moment = require("moment/moment");
const Op = Sequelize.Op;

const Tree = db.tree;

const updateTreeOven = async (req, res) => {
  const { trees } = req.body;
  trees.forEach(async (tree) => {
    await Tree.update(
      {
        yerlestigiFirin: tree.yerlestigiFirin,
        erkenFirinGrubunaEklendiMi: tree.erkenFirinGrubunaEklendiMi,
      },
      {
        where: {
          treeId: tree.treeId,
        },
      }
    );
  });
  res.status(200).send({
    message: "Update Success",
  });
};

module.exports = updateTreeOven;
