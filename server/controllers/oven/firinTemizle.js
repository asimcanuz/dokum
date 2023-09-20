const db = require("../../models");

const JobGroup = db.jobGroup;
const Tree = db.tree;

const firinTemizle = async (req, res) => {
  const { jobGroupId } = req.body;
  // jobGroup erken fırın olusturuldu mu true

  await JobGroup.update(
    {
      erkenFırınGrubuOlusturulduMu: false,
      normalFırınGrubuOlusturulduMu: false,
    },
    {
      where: {
        id: jobGroupId,
      },
    }
  );

  await Tree.update(
    {
      erkenFirinGrubunaEklendiMi: false,
      yerlestigiFirin: null,
      yerlesmesiGerekenFirin: null,
      fırınId: null,
    },
    {
      where: {
        active: true,
        finished: false,
        jobGroupId: jobGroupId,
        // today
      },
    }
  );

  res.status(200).send({ message: "success" });
};

module.exports = firinTemizle;
