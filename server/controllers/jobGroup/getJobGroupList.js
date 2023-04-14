const { Sequelize } = require("sequelize");
const db = require("../../models");
const moment = require("moment/moment");

const JobGroup = db.jobGroup;

/**
 * @description
 */
const getJobGroupList = async (req, res) => {
  var jobGroupList = await JobGroup.findAll({
    where: {
      isFinished: false,
    },
  });

  // jobGroup'lardaki ağaçların sayısı bul
  jobGroupList.forEach(async (jobGroup, index) => {
    const treeCount = await db.tree.count({
      where: {
        jobGroupId: jobGroup.id,
      },
    });
    jobGroupList[index]["treeCount"] = treeCount || 0;
  });

  if (!jobGroupList) res.status(401).send();
  res.status(200).send({ jobGroupList });
};

module.exports = getJobGroupList;
