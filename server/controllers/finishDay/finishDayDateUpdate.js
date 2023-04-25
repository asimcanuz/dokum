const { Sequelize } = require("sequelize");
const db = require("../../models");
const Op = Sequelize.Op;

const Tree = db.tree;

const finishDayDateUpdate = async (req, res) => {
  const { treeId, jobGroupId } = req.body;
  console.log("treeId: " + treeId);
  console.log("jobGroupId: " + jobGroupId);

  // gelen treeId'ye ait tarihi update et
  const _tree = await Tree.update(
    {
      jobGroupId: jobGroupId,
      isOld: true,
    },
    {
      where: {
        treeId,
      },
    }
  );

  if (!_tree) res.status(401).send({ message: "Tarih güncellenemedi." });
  res.status(200).send({ message: "Tarih güncellendi." });
};

module.exports = finishDayDateUpdate;
