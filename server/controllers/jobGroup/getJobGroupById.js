const { Sequelize } = require("sequelize");
const db = require("../../models");
const moment = require("moment/moment");

const JobGroup = db.jobGroup;

/**
 * @description
 */
const getJobGroupById = async (req, res) => {
  const jobGroup = await JobGroup.findAll({
    where: {
      id: req.params.id,
    },
  });

  if (!jobGroup) res.status(401).send();
  res.status(200).send({ jobGroup });
};

module.exports = getJobGroupById;
