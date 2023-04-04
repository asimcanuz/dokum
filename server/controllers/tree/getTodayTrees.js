const { Sequelize } = require("sequelize");
const db = require("../../models");
const moment = require("moment/moment");
const Op = Sequelize.Op;

const Tree = db.tree;
const TODAY = moment().tz("Europe/Istanbul").format("YYYY-MM-DD");

const getTodayTrees = async (req, res) => {
  var isHaveNotFinished = false;

  // bütün treeleri kontrol et, eğer finished değilse finished false adında bir değeri response olarak döndür.
  const _trees = await Tree.findAll({
    where: {
      date: {
        // bügünden önceki günleri de kontrol etmek için [Op.lte] kullanılabilir.
        [Op.lt]: TODAY,
      },
      active: true,
      finished: false,
    },
    // sadece id field dön
    attributes: ["treeId"],
  });
  if (_trees.length > 0) {
    isHaveNotFinished = true;
  }
  const trees = await Tree.findAll({
    where: {
      active: true,
      finished: false,
      // today
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

  if (!trees) res.status(401).send({ message: "Trees Not Found!" });
  res.status(200).send({ trees, isHaveNotFinished });
};

module.exports = getTodayTrees;
