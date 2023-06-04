const db = require("../../models");
const { Op } = require("sequelize");

const Tree = db.tree;

const queryFirinListesi = async (req, res) => {
  const { jobGroupId } = req.body;
  var firinListesi = {
    1: {
      ust: [],
      alt: [],
    },
    2: {
      ust: [],
      alt: [],
    },
    3: {
      ust: [],
      alt: [],
    },
  };
  const trees = await Tree.findAll({
    where: {
      active: true,
      finished: false,
      jobGroupId: jobGroupId,
      fırınId: {
        [Op.not]: null,
      },
    },

    include: [
      {
        model: db.jobGroup,
        where: {
          isFinished: false,
        },
      },
      {
        model: db.fırın,
      },
    ],
    order: [["customerQuantity", "DESC"]],
  });
  if (trees.length > 0) {
    trees.forEach((tree) => {
      const agacFirin = tree.fırın;
      firinListesi[agacFirin.fırınSıra][agacFirin.fırınKonum].push({
        treeNo: tree.treeNo,
        yerlestigiFirin: agacFirin.fırınSıra,
        yerlestigiKonum: agacFirin.fırınKonum,
        yerlesmesiGerekenFirin: tree.yerlesmesiGerekenFirin,
      });
    });
  }
  res.status(200).send({ firinListesi });
};

module.exports = queryFirinListesi;
