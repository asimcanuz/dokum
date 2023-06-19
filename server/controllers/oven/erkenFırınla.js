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

    for (const konum of ["ust", "alt"]) {
      for (const type of erkenFirinGirebilecekler[konum]) {
        const { kalinlik, renk, ayar } = type;

        if (
          (ayar === agacAyar || ayar === "Hepsi") &&
          (renk === agacRenk || renk === "Hepsi") &&
          (kalinlik === agacKalinlik || kalinlik === "Hepsi") &&
          (element.yerlestigiFirin === undefined ||
            element.yerlestigiFirin === null)
        ) {
          if (konum === "ust") {
            let ustFirinSayisi = erkenFirinListesi.filter((erkenFirin) => {
              if (erkenFirin.firinId === firinlar[0].fırınId) {
                return erkenFirin.firinId;
              }
            });
            if (Object.keys(ustFirinSayisi).length >= 17) break;

            // if (ustFirinSayisi >= 17) continue;
          }
          if (konum === "alt") {
            let altFirinSayisi = erkenFirinListesi.filter((erkenFirin) => {
              if (erkenFirin.firinId === firinlar[1].fırınId) {
                return erkenFirin.firinId;
              }
            });
            if (Object.keys(altFirinSayisi).length >= 17) break;
          }

          element.yerlestigiFirin =
            konum === "ust" ? firinlar[0].fırınId : firinlar[1].fırınId;
          let obj = {
            treeId: treeId,
            firinId: element.yerlestigiFirin,
          };
          erkenFirinListesi.push(obj);
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
