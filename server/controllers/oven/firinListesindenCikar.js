const db = require("../../models");

const Tree = db.tree;

const firinListesindenCikar = async (req, res) => {
  const { treeId } = req.body;
  await Tree.update(
    {
      erkenFirinGrubunaEklendiMi: false,
      yerlestigiFirin: null,
      yerlesmesiGerekenFirin: null,
      fırınId: null,
    },
    {
      where: {
        treeId: treeId,
        // today
      },
    }
  );

  res.status(200).send({ message: "success" });
};

module.exports = firinListesindenCikar;
