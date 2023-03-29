//butona tıklanınca gün sonu

// tarih değişince tarihi update et

const { Sequelize } = require("sequelize");
const db = require("../../models");
const Op = Sequelize.Op;

const Tree = db.tree;

const finishDayUpdate = async (req, res) => {
  const { treeIds } = req.body;

  // tüm treeIds'lerin finished değerini true yap
  const _trees = await Tree.update(
    { finished: true },
    {
      where: {
        treeId: {
          [Op.in]: treeIds,
        },
      },
    }
  );

  if (!_trees) res.status(401).send({ message: "Gün sonu yapılamadı." });
  res.status(200).send({ message: "Gün sonu yapıldı." });
};

module.exports = finishDayUpdate;
