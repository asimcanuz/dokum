const { Sequelize } = require("sequelize");
const db = require("../../models");
const Op = Sequelize.Op;

const Tree = db.tree;
const JobGroup = db.jobGroup;

const finishDayWithJobGroup = async (req, res) => {
  const { jobGroupId } = req.body;

  // gelen treeId'ye ait tarihi update et
  const _tree = await Tree.update(
    { finished: true },
    {
      where: {
        jobGroupId,
      },
    }
  );

  // jobGroup'lardaki ağaçları'da bitir.
  await JobGroup.update(
    {
      isFinished: true,
    },
    {
      where: {
        id: jobGroupId,
      },
    }
  );

  if (!_tree) res.status(401).send({ message: "Tarih güncellenemedi." });
  res.status(200).send({ message: "Gün sonu yapıldı." });
};

module.exports = finishDayWithJobGroup;
