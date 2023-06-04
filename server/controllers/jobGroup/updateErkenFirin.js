const { Sequelize } = require("sequelize");
const db = require("../../models");
const moment = require("moment/moment");
const Op = Sequelize.Op;

const JobGroup = db.jobGroup;

const updateErkenFirin = async (req, res) => {
  const { id } = req.body;
  await JobGroup.update(
    {
      erkenFırınGrubuOlusturulduMu: true,
    },
    {
      where: {
        id: id,
      },
    }
  );
  res.status(200).send({
    message: "Update Success",
  });
};

module.exports = updateErkenFirin;
