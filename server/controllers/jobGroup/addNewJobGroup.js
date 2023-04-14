const db = require("../../models");
const moment = require("moment/moment");

const JobGroup = db.jobGroup;

/**
 * @description
 */
const addNewJobGroup = async (req, res) => {
  const { date } = req.body;

  const jobGroup = await JobGroup.create({
    date: moment(date).format("YYYY-MM-DD"),
    number: moment(date).format("YYYY-MM-DD"),
  });

  if (!jobGroup) res.status(401).send();
  res.status(200).send({ jobGroup });
};

module.exports = addNewJobGroup;
