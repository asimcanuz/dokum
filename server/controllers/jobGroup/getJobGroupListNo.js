const { Sequelize } = require("sequelize");
const db = require("../../models");
const Op = Sequelize.Op;

const Tree = db.tree;

const getJobGroupListNo = async (req, res) => {
  const { jobGroupId } = req.query;

  const trees = await Tree.findAll({
    where: {
      active: true,
      finished: false,
      jobGroupId: jobGroupId,
    },
  });

  let listNoList = trees.map((tree) => tree.listNo);

  if (!trees) res.status(401).send({ message: "Trees Not Found!" });
  res.status(200).send(listNoList);
};

module.exports = getJobGroupListNo;
