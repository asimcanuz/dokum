const db = require("../../models");
const firinlar = require("../../constants/firinConstans");
const firinListesi = require("../../constants/firinListesiConstant");
const { Op } = require("sequelize");

const JobGroup = db.jobGroup;
const Oven = db.oven;
const Tree = db.tree;

const erkenFırınla = async (req, res) => {
  const { jobGroupId } = req.body;
  // jobGroup erken fırın olusturuldu mu true
  const jobGroup = await JobGroup.findByPk(jobGroupId);
  let erkenFirinListesi = [];
  if (jobGroup.isDeleted === true) {
    return res.status(404).send("İş Grubu silinmiş!");
  }
  if (jobGroup.isFinished === true) {
    return res.status(400).send("İş grubu bitirilmiş!");
  }

  if (jobGroup.normalFırınGrubuOlusturulduMu === true) {
    return res.status(400).send("Normal Fırın Oluşturulmuş!");
  }
  if (jobGroup.erkenFırınGrubuOlusturulduMu === true) {
    return res.status(400).send("Erken Fırın Oluşturulmuş!");
  }

  // job group fırınlanmayan ağaçları getir
  const trees = await Tree.findAll({
    where: {
      active: true,
      finished: false,
      jobGroupId: jobGroupId,
      erkenFirinGrubunaEklendiMi: false,
      fırınId: {
        [Op.eq]: null,
      },
      // today
    },

    include: [
      {
        model: db.jobGroup,
        where: {
          isFinished: false,
        },
      },
      { model: db.wax },
      { model: db.option },
      { model: db.thick },
      { model: db.color },
      { model: db.treeStatus },
    ],
    order: [["customerQuantity", "DESC"]],
  });

  const erkenFirinGirebilecekler = firinListesi[1];
  trees.forEach((element) => {
    const { treeId, color, option, thick } = element;
    const { colorName: agacRenk } = color;
    const { optionText: agacAyar } = option;
    const { thickName: agacKalinlik } = thick;

    for (const konum of ["alt", "ust"]) {
      for (const type of erkenFirinGirebilecekler[konum]) {
        const { kalinlik, renk, ayar } = type;

        if (
          (ayar === agacAyar || ayar === "Hepsi") &&
          (renk === agacRenk || renk === "Hepsi") &&
          (kalinlik === agacKalinlik || kalinlik === "Hepsi") &&
          (element.yerlestigiFirin === undefined ||
            element.yerlestigiFirin === null)
        ) {
          element.yerlestigiFirin =
            konum === "ust" ? firinlar[0].fırınId : firinlar[1].fırınId;
          if (erkenFirinListesi?.length < 17) {
            let obj = {
              treeId: treeId,
              firinId:
                konum === "ust" ? firinlar[0].fırınId : firinlar[1].fırınId,
            };

            erkenFirinListesi.push(obj);
          }
        }
      }
    }
  });

  await JobGroup.update(
    { erkenFırınGrubuOlusturulduMu: true },
    {
      where: {
        id: jobGroupId,
      },
    }
  );

  erkenFirinListesi.forEach(async (firin) => {
    await Tree.update(
      {
        yerlestigiFirin: firin.firinId,
        fırınId: firin.firinId,
        erkenFirinGrubunaEklendiMi: true,
      },
      {
        where: {
          treeId: firin.treeId,
        },
      }
    );
  });

  res.status(200).send({ erkenFirinListesi, message: "Fırınlama başarılı" });
};

module.exports = erkenFırınla;
