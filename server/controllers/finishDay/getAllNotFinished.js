const { Sequelize } = require("sequelize");
const db = require("../../models");
const moment = require("moment/moment");
const Op = Sequelize.Op;

const Tree = db.tree;
const TODAY = moment().format("YYYY-MM-DD");

/**
 * @description Bu fonksiyon tüm günlerin bitmemiş ağaçlarını döndürür.
 */
const getAllNotFinished = async (req, res) => {
  // bütün treeleri kontrol et,bugüne ait değilse ve finished false olan ağaçları döndür.
  const _trees = await Tree.findAll({
    where: {
      active: true,
      finished: false,
    },
    include: [
      { model: db.wax },
      { model: db.option },
      { model: db.creator },
      { model: db.thick },
      { model: db.color },
      { model: db.treeStatus },
      { model: db.order },
    ],
  });

  if (!_trees)
    res.status(401).send({ message: "Gün sonu yapılacak işlem yok." });
  res.status(200).send({ trees: _trees });
};

module.exports = getAllNotFinished;
