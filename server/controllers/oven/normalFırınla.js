const firinlar = require("../../constants/firinConstans");
const firinListesi = require("../../constants/firinListesiConstant");
const db = require("../../models");
const { Op } = require("sequelize");

const JobGroup = db.jobGroup;
const Oven = db.oven;
const Tree = db.tree;

async function normalFırınla(req, res) {
  const { jobGroupId } = req.body;
  const jobGroup = await JobGroup.findByPk(jobGroupId);
  const firin1ust = 1;
  const firin1alt = 2;
  const firin2ust = 3;
  const firin2alt = 4;
  const firin3ust = 5;
  const firin3alt = 6;
  let normalFırınListesi = {
    1: {
      ust: [],
      alt: [],
    },
    2: {
      ust: [],
      alt: [],
    },
    3: {
      ust: [],
      alt: [],
    },
  };
  let yerlesenListesi = [];
  let yerlesenFirinListesiId = [];
  let firinStart = 1;

  if (jobGroup.isDeleted) {
    return res.status(500).send({ message: "İş grubu silinmiş!" });
  }

  if (jobGroup.isFinished) {
    return res.status(500).send({ message: "İş grubu tamamlandı" });
  }

  if (jobGroup.normalFırınGrubuOlusturulduMu) {
    return res.status(500).send({ message: "Normal iş grubu tamamlandı" });
  }

  if (jobGroup.erkenFırınGrubuOlusturulduMu) {
    firinStart = 2;
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

    include: [{ model: db.option }, { model: db.thick }, { model: db.color }],
    order: [["customerQuantity", "DESC"]],
  });

  // 13 + 4 iç

  // 13+4 doldu ve fırın üst tarafı boş değil 1 -> 3, 3->2 3-iç
  trees.forEach((element) => {
    const { treeId, color, option, thick } = element;
    const { colorName: agacRenk } = color;
    const { optionText: agacAyar } = option;
    const { thickName: agacKalinlik } = thick;

    for (let i = firinStart; i <= 3; i++) {
      for (const konum of ["alt", "ust"]) {
        for (const type of firinListesi[i][konum]) {
          const { kalinlik, renk, ayar } = type;
          if (
            (ayar === agacAyar || ayar === "Hepsi") &&
            (renk === agacRenk || renk === "Hepsi") &&
            (kalinlik === agacKalinlik || kalinlik === "Hepsi") &&
            (element.yerlestigiFirin === undefined ||
              element.yerlestigiFirin === null)
          ) {
            let firinId = firinlar.find((firin) => {
              if (firin.fırınKonum === konum && firin.fırınSıra === i) {
                return firin.fırınId;
              }
            }).fırınId;

            if (normalFırınListesi[i][konum].length < 13) {
              element.yerlestigiFirin = `${i}-${konum}`;
              normalFırınListesi[i][konum].push({
                treeId: treeId,
                firinId: firinId,
                konum: "",
              });
              yerlesenListesi.push({
                treeId,
                firinId,
              });
              yerlesenFirinListesiId.push(treeId);
            } else if (
              normalFırınListesi[i][konum].length >= 13 &&
              normalFırınListesi[i][konum].length < 17
            ) {
              element.yerlestigiFirin = `${i}-${konum} `;

              normalFırınListesi[i][konum].push({
                treeId: treeId,
                firinId: firinId,
                konum: "",
              });
              yerlesenFirinListesiId.push(treeId);

              yerlesenListesi.push({
                treeId,
                firinId,
              });
            } else {
              continue;
            }
          }
        }
      }
    }
  });

  let yerlesmeyenListesi = {
    1: {
      ust: [],
      alt: [],
    },
    2: {
      ust: [],
      alt: [],
    },
    3: {
      ust: [],
      alt: [],
    },
  };
  trees.forEach((tree) => {
    if (!yerlesenFirinListesiId.includes(tree.treeId)) {
      const { treeId, color, option, thick } = tree;
      const { colorName: agacRenk } = color;
      const { optionText: agacAyar } = option;
      const { thickName: agacKalinlik } = thick;

      for (let i = firinStart; i <= 3; i++) {
        for (const konum of ["alt", "ust"]) {
          for (const type of firinListesi[i][konum]) {
            const { kalinlik, renk, ayar } = type;
            if (
              (ayar === agacAyar || ayar === "Hepsi") &&
              (renk === agacRenk || renk === "Hepsi") &&
              (kalinlik === agacKalinlik || kalinlik === "Hepsi") &&
              (tree.yerlestigiFirin === undefined ||
                tree.yerlestigiFirin === null)
            ) {
              //  erkenFirinListesi.push({
              //    treeId: treeId,
              //    firinId:
              //      konum === "ust" ? firinlar[0].fırınId : firinlar[1].fırınId,
              //  });
              let firinId = firinlar.find((firin) => {
                if (firin.fırınKonum === konum && firin.fırınSıra === i) {
                  return firin.fırınId;
                }
              }).fırınId;
              yerlesmeyenListesi[i][konum].push({
                treeId: treeId,
                firinId: firinId,
                konum: "",
              });
              tree.yerlestigiFirin = `${i}-${konum}`;
            }
          }
        }
      }
    }
  });
  //birinci fırın kontroller
  let ust1length = normalFırınListesi[1].ust.length;
  let alt1length = normalFırınListesi[1].alt.length;
  let ust2length = normalFırınListesi[2].ust.length;
  let alt2length = normalFırınListesi[2].alt.length;
  let ust3length = normalFırınListesi[3].ust.length;
  let alt3length = normalFırınListesi[3].alt.length;

  if (!jobGroup.erkenFırınGrubuOlusturulduMu) {
    let yerlesmeyenBirUstLength = yerlesmeyenListesi[1].ust.length;

    if (yerlesmeyenBirUstLength > 0) {
      if (alt1length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt1length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenBirUstLength -= eklenebilecekElemanSayisi;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[1].ust[index] === undefined) break;
            yerlesmeyenBirUstLength--;
            yerlesmeyenListesi[1].ust[index].konum = "1-ust";
            yerlesmeyenListesi[1].ust[index].firinId = firin1alt;
            normalFırınListesi[1].alt.push(yerlesmeyenListesi[1].ust[index]);
            delete yerlesmeyenListesi[1].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenBirUstLength > 0) {
      if (ust3length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenBirUstLength -= ust3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[1].ust[index] === undefined) break;
            yerlesmeyenBirUstLength--;
            yerlesmeyenListesi[1].ust[index].firinId = firin3ust;
            normalFırınListesi[3].ust.push(yerlesmeyenListesi[1].ust[index]);
            delete yerlesmeyenListesi[1].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenBirUstLength > 0) {
      if (alt3length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenBirUstLength -= alt3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[1].ust[index] === undefined) break;
            yerlesmeyenBirUstLength--;
            yerlesmeyenListesi[1].ust[index].konum = "1-ust";
            yerlesmeyenListesi[1].ust[index].firinId = firin3alt;

            normalFırınListesi[3].alt.push(yerlesmeyenListesi[1].ust[index]);
            delete yerlesmeyenListesi[1].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenBirUstLength > 0) {
      if (ust2length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenBirUstLength -= ust2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[1].ust[index] === undefined) break;
            yerlesmeyenBirUstLength--;
            yerlesmeyenListesi[1].ust[index].konum = "1-ust";
            yerlesmeyenListesi[1].ust[index].firinId = firin2ust;

            normalFırınListesi[2].ust.push(yerlesmeyenListesi[1].ust[index]);
            delete yerlesmeyenListesi[1].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenBirUstLength > 0) {
      if (alt2length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenBirUstLength -= alt2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[1].ust[index] === undefined) break;
            yerlesmeyenBirUstLength--;
            yerlesmeyenListesi[1].ust[index].konum = "1-ust";
            yerlesmeyenListesi[1].ust[index].firinId = firin2alt;

            normalFırınListesi[2].alt.push(yerlesmeyenListesi[1].ust[index]);
            delete yerlesmeyenListesi[1].ust[index];
          }
        }
      }
    }

    let yerlesmeyenBirAltLength = yerlesmeyenListesi[1].alt.length;

    if (yerlesmeyenBirAltLength > 0) {
      if (ust1length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust1length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenBirAltLength -= eklenebilecekElemanSayisi;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[1].alt[index] === undefined) break;
            yerlesmeyenBirAltLength--;
            yerlesmeyenListesi[1].alt[index].konum = "1-alt";
            yerlesmeyenListesi[1].alt[index].firinId = firin1ust;

            normalFırınListesi[1].ust.push(yerlesmeyenListesi[1].alt[index]);
            delete yerlesmeyenListesi[1].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenBirAltLength > 0) {
      if (ust3length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenBirAltLength -= ust3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[1].alt[index] === undefined) break;
            yerlesmeyenBirAltLength--;
            yerlesmeyenListesi[1].alt[index].konum = "1-alt";
            yerlesmeyenListesi[1].alt[index].firinId = firin3ust;

            normalFırınListesi[3].ust.push(yerlesmeyenListesi[1].alt[index]);
            delete yerlesmeyenListesi[1].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenBirAltLength > 0) {
      if (alt3length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenBirAltLength -= alt3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[1].alt[index] === undefined) break;
            yerlesmeyenBirAltLength--;
            yerlesmeyenListesi[1].alt[index].konum = "1-alt";
            yerlesmeyenListesi[1].alt[index].firinId = firin3alt;

            normalFırınListesi[3].alt.push(yerlesmeyenListesi[1].alt[index]);
            delete yerlesmeyenListesi[1].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenBirAltLength > 0) {
      if (ust2length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenBirAltLength -= ust2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[1].alt[index] === undefined) break;
            yerlesmeyenBirAltLength--;
            yerlesmeyenListesi[1].alt[index].konum = "1-alt";
            yerlesmeyenListesi[1].alt[index].firinId = firin2ust;

            normalFırınListesi[2].ust.push(yerlesmeyenListesi[1].alt[index]);
            delete yerlesmeyenListesi[1].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenBirAltLength > 0) {
      if (alt2length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenBirAltLength -= alt2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[1].alt[index] === undefined) break;
            yerlesmeyenBirAltLength--;
            yerlesmeyenListesi[1].alt[index].konum = "1-alt";
            yerlesmeyenListesi[1].alt[index].firinId = firin2alt;

            normalFırınListesi[2].alt.push(yerlesmeyenListesi[1].alt[index]);
            delete yerlesmeyenListesi[1].alt[index];
          }
        }
      }
    }

    let yerlesmeyenIkiUstLength = yerlesmeyenListesi[2].ust.length;

    if (yerlesmeyenIkiUstLength > 0) {
      if (alt2length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiUstLength -= alt2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].ust[index] === undefined) break;
            yerlesmeyenIkiUstLength--;
            yerlesmeyenListesi[2].ust[index].konum = "2-ust";
            yerlesmeyenListesi[2].ust[index].firinId = firin2alt;

            normalFırınListesi[2].alt.push(yerlesmeyenListesi[2].ust[index]);
            delete yerlesmeyenListesi[2].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenIkiUstLength > 0) {
      if (ust3length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiUstLength -= ust3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].ust[index] === undefined) break;
            yerlesmeyenIkiUstLength--;
            yerlesmeyenListesi[2].ust[index].konum = "2-ust";
            yerlesmeyenListesi[2].ust[index].firinId = firin3ust;

            normalFırınListesi[3].ust.push(yerlesmeyenListesi[2].ust[index]);
            delete yerlesmeyenListesi[2].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenIkiUstLength > 0) {
      if (alt3length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiUstLength -= alt3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].ust[index] === undefined) break;
            yerlesmeyenIkiUstLength--;
            yerlesmeyenListesi[2].ust[index].konum = "2-ust";
            yerlesmeyenListesi[2].ust[index].firinId = firin3alt;

            normalFırınListesi[3].alt.push(yerlesmeyenListesi[2].ust[index]);
            delete yerlesmeyenListesi[2].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenIkiUstLength > 0) {
      if (ust1length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust1length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiUstLength -= eklenebilecekElemanSayisi;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].ust[index] === undefined) break;
            yerlesmeyenIkiUstLength--;
            yerlesmeyenListesi[2].ust[index].konum = "2-ust";
            yerlesmeyenListesi[2].ust[index].firinId = firin1ust;

            normalFırınListesi[1].ust.push(yerlesmeyenListesi[2].ust[index]);
            delete yerlesmeyenListesi[2].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenIkiUstLength > 0) {
      if (alt1length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt1length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiUstLength -= eklenebilecekElemanSayisi;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].ust[index] === undefined) break;
            yerlesmeyenIkiUstLength--;
            yerlesmeyenListesi[2].ust[index].konum = "2-ust";
            yerlesmeyenListesi[2].ust[index].firinId = firin1alt;

            normalFırınListesi[1].alt.push(yerlesmeyenListesi[2].ust[index]);
            delete yerlesmeyenListesi[2].ust[index];
          }
        }
      }
    }

    let yerlesmeyenIkiAltLength = yerlesmeyenListesi[2].alt.length;

    if (yerlesmeyenIkiAltLength > 0) {
      if (ust2length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiAltLength -= ust2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].alt[index] === undefined) break;
            yerlesmeyenIkiAltLength--;
            yerlesmeyenListesi[2].alt[index].konum = "2-alt";
            yerlesmeyenListesi[2].alt[index].firinId = firin2ust;

            normalFırınListesi[2].ust.push(yerlesmeyenListesi[2].alt[index]);
            delete yerlesmeyenListesi[2].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenIkiAltLength > 0) {
      if (ust3length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiAltLength -= ust3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].alt[index] === undefined) break;
            yerlesmeyenIkiAltLength--;
            yerlesmeyenListesi[2].alt[index].konum = "2-alt";
            yerlesmeyenListesi[2].alt[index].firinId = firin3ust;

            normalFırınListesi[3].ust.push(yerlesmeyenListesi[2].alt[index]);
            delete yerlesmeyenListesi[2].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenIkiAltLength > 0) {
      if (alt3length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiAltLength -= alt3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].alt[index] === undefined) break;
            yerlesmeyenIkiAltLength--;
            yerlesmeyenListesi[2].alt[index].konum = "2-alt";
            yerlesmeyenListesi[2].alt[index].firinId = firin3alt;

            normalFırınListesi[3].alt.push(yerlesmeyenListesi[2].alt[index]);
            delete yerlesmeyenListesi[2].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenIkiAltLength > 0) {
      if (ust1length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust1length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiAltLength -= eklenebilecekElemanSayisi;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].alt[index] === undefined) break;
            yerlesmeyenIkiAltLength--;
            yerlesmeyenListesi[2].alt[index].konum = "2-alt";
            yerlesmeyenListesi[2].alt[index].firinId = firin1ust;

            normalFırınListesi[1].ust.push(yerlesmeyenListesi[2].alt[index]);
            delete yerlesmeyenListesi[2].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenIkiAltLength > 0) {
      if (alt1length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt1length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiAltLength -= eklenebilecekElemanSayisi;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].alt[index] === undefined) break;
            yerlesmeyenIkiAltLength--;
            yerlesmeyenListesi[2].alt[index].konum = "2-alt";
            yerlesmeyenListesi[2].alt[index].firinId = firin1alt;

            normalFırınListesi[1].alt.push(yerlesmeyenListesi[2].alt[index]);
            delete yerlesmeyenListesi[2].alt[index];
          }
        }
      }
    }

    let yerlesmeyenUcUstLength = yerlesmeyenListesi[3].ust.length;

    if (yerlesmeyenUcUstLength > 0) {
      if (alt3length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcUstLength -= alt3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].ust[index] === undefined) break;
            yerlesmeyenUcUstLength--;
            yerlesmeyenListesi[3].ust[index].konum = "3-ust";
            yerlesmeyenListesi[3].ust[index].firinId = firin3alt;

            normalFırınListesi[3].alt.push(yerlesmeyenListesi[3].ust[index]);
            delete yerlesmeyenListesi[3].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenUcUstLength > 0) {
      if (ust2length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcUstLength -= ust2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].ust[index] === undefined) break;
            yerlesmeyenUcUstLength--;
            yerlesmeyenListesi[3].ust[index].konum = "3-ust";
            yerlesmeyenListesi[3].ust[index].firinId = firin2ust;

            normalFırınListesi[2].ust.push(yerlesmeyenListesi[3].alt[index]);
            delete yerlesmeyenListesi[3].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenUcUstLength > 0) {
      if (ust1length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust1length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcUstLength -= eklenebilecekElemanSayisi;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].ust[index] === undefined) break;
            yerlesmeyenUcUstLength--;
            yerlesmeyenListesi[3].ust[index].konum = "3-ust";
            yerlesmeyenListesi[3].ust[index].firinId = firin1ust;

            normalFırınListesi[1].ust.push(yerlesmeyenListesi[3].ust[index]);
            delete yerlesmeyenListesi[3].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenUcUstLength > 0) {
      if (alt1length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt1length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcUstLength -= eklenebilecekElemanSayisi;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].ust[index] === undefined) break;
            yerlesmeyenUcUstLength--;
            yerlesmeyenListesi[3].ust[index].konum = "3-ust";
            yerlesmeyenListesi[3].ust[index].firinId = firin1alt;

            normalFırınListesi[1].alt.push(yerlesmeyenListesi[3].ust[index]);
            delete yerlesmeyenListesi[3].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenUcUstLength > 0) {
      if (alt2length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcUstLength -= alt2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].ust[index] === undefined) break;
            yerlesmeyenUcUstLength--;
            yerlesmeyenListesi[3].ust[index].konum = "3-ust";
            yerlesmeyenListesi[3].ust[index].firinId = firin2alt;

            normalFırınListesi[2].alt.push(yerlesmeyenListesi[3].ust[index]);
            delete yerlesmeyenListesi[3].ust[index];
          }
        }
      }
    }

    let yerlesmeyenUcAltLength = yerlesmeyenListesi[3].alt.length;

    if (yerlesmeyenUcAltLength > 0) {
      if (ust1length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust1length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcAltLength -= eklenebilecekElemanSayisi;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].alt[index] === undefined) break;
            yerlesmeyenUcAltLength--;
            yerlesmeyenListesi[3].alt[index].konum = "3-alt";
            yerlesmeyenListesi[3].alt[index].firinId = firin1ust;

            normalFırınListesi[1].ust.push(yerlesmeyenListesi[3].alt[index]);
            delete yerlesmeyenListesi[3].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenUcAltLength > 0) {
      if (alt1length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt1length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcAltLength -= eklenebilecekElemanSayisi;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].alt[index] === undefined) break;
            yerlesmeyenUcAltLength--;
            yerlesmeyenListesi[3].alt[index].konum = "3-alt";
            yerlesmeyenListesi[3].alt[index].firinId = firin1alt;

            normalFırınListesi[1].alt.push(yerlesmeyenListesi[3].alt[index]);
            delete yerlesmeyenListesi[3].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenUcAltLength > 0) {
      if (alt2length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcAltLength -= alt2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].alt[index] === undefined) break;
            yerlesmeyenUcAltLength--;
            yerlesmeyenListesi[3].alt[index].konum = "3-alt";
            yerlesmeyenListesi[3].alt[index].firinId = firin2alt;

            normalFırınListesi[2].alt.push(yerlesmeyenListesi[3].alt[index]);
            delete yerlesmeyenListesi[3].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenUcAltLength > 0) {
      if (alt3length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcAltLength -= alt3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].alt[index] === undefined) break;
            yerlesmeyenUcAltLength--;
            yerlesmeyenListesi[3].alt[index].konum = "3-alt";
            yerlesmeyenListesi[3].alt[index].firinId = firin3ust;

            normalFırınListesi[3].ust.push(yerlesmeyenListesi[3].alt[index]);
            delete yerlesmeyenListesi[3].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenUcAltLength > 0) {
      if (ust2length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcAltLength -= ust2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].alt[index] === undefined) break;
            yerlesmeyenUcAltLength--;
            yerlesmeyenListesi[3].alt[index].konum = "3-alt";
            yerlesmeyenListesi[3].alt[index].firinId = firin2ust;

            normalFırınListesi[2].ust.push(yerlesmeyenListesi[3].alt[index]);
            delete yerlesmeyenListesi[3].alt[index];
          }
        }
      }
    }
  } else {
    let yerlesmeyenIkiUstLength = yerlesmeyenListesi[2].ust.length;

    if (yerlesmeyenIkiUstLength > 0) {
      if (alt2length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiUstLength -= alt2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].ust[index] === undefined) break;
            yerlesmeyenIkiUstLength--;
            yerlesmeyenListesi[2].ust[index].konum = "2-ust";
            yerlesmeyenListesi[2].ust[index].firinId = firin2alt;

            normalFırınListesi[2].alt.push(yerlesmeyenListesi[2].ust[index]);
            delete yerlesmeyenListesi[2].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenIkiUstLength > 0) {
      if (ust3length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiUstLength -= ust3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].ust[index] === undefined) break;
            yerlesmeyenIkiUstLength--;
            yerlesmeyenListesi[2].ust[index].konum = "2-ust";
            yerlesmeyenListesi[2].ust[index].firinId = firin3ust;

            normalFırınListesi[3].ust.push(yerlesmeyenListesi[2].ust[index]);
            delete yerlesmeyenListesi[2].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenIkiUstLength > 0) {
      if (alt3length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiUstLength -= alt3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].ust[index] === undefined) break;
            yerlesmeyenIkiUstLength--;
            yerlesmeyenListesi[2].ust[index].konum = "2-ust";
            yerlesmeyenListesi[2].ust[index].firinId = firin3alt;

            normalFırınListesi[3].alt.push(yerlesmeyenListesi[2].ust[index]);
            delete yerlesmeyenListesi[2].ust[index];
          }
        }
      }
    }

    let yerlesmeyenIkiAltLength = yerlesmeyenListesi[2].alt.length;

    if (yerlesmeyenIkiAltLength > 0) {
      if (ust2length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiAltLength -= ust2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].alt[index] === undefined) break;
            yerlesmeyenIkiAltLength--;
            yerlesmeyenListesi[2].alt[index].konum = "2-alt";
            yerlesmeyenListesi[2].alt[index].firinId = firin2alt;

            normalFırınListesi[2].ust.push(yerlesmeyenListesi[2].alt[index]);
            delete yerlesmeyenListesi[2].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenIkiAltLength > 0) {
      if (ust3length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiAltLength -= ust3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].alt[index] === undefined) break;
            yerlesmeyenIkiAltLength--;
            yerlesmeyenListesi[2].alt[index].konum = "2-alt";
            yerlesmeyenListesi[2].alt[index].firinId = firin3ust;

            normalFırınListesi[3].ust.push(yerlesmeyenListesi[2].alt[index]);
            delete yerlesmeyenListesi[2].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenIkiAltLength > 0) {
      if (alt3length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt3length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenIkiAltLength -= alt3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[2].alt[index] === undefined) break;
            yerlesmeyenIkiAltLength--;
            yerlesmeyenListesi[2].alt[index].konum = "2-alt";
            yerlesmeyenListesi[2].alt[index].firinId = firin3alt;

            normalFırınListesi[3].alt.push(yerlesmeyenListesi[2].alt[index]);
            delete yerlesmeyenListesi[2].alt[index];
          }
        }
      }
    }

    let yerlesmeyenUcUstLength = yerlesmeyenListesi[3].ust.length;

    if (yerlesmeyenUcUstLength > 0) {
      if (alt3length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt3length;
        if (eklenebilecekElemanSayisi > 0) {
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].ust[index] === undefined) break;
            yerlesmeyenUcUstLength--;
            yerlesmeyenListesi[3].ust[index].konum = "3-ust";
            yerlesmeyenListesi[3].ust[index].firinId = firin3alt;

            normalFırınListesi[3].alt.push(yerlesmeyenListesi[3].ust[index]);
            delete yerlesmeyenListesi[3].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenUcUstLength > 0) {
      if (ust2length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcUstLength -= ust2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].ust[index] === undefined) break;
            yerlesmeyenUcUstLength--;
            yerlesmeyenListesi[3].ust[index].konum = "3-ust";
            yerlesmeyenListesi[3].ust[index].firinId = firin2ust;
            normalFırınListesi[2].ust.push(yerlesmeyenListesi[3].ust[index]);
            delete yerlesmeyenListesi[3].ust[index];
          }
        }
      }
    }
    if (yerlesmeyenUcUstLength > 0) {
      if (alt2length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcUstLength -= alt2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].ust[index] === undefined) break;
            yerlesmeyenUcUstLength--;
            yerlesmeyenListesi[3].ust[index].konum = "3-ust";
            yerlesmeyenListesi[3].ust[index].firinId = firin2alt;
            normalFırınListesi[2].alt.push(yerlesmeyenListesi[3].ust[index]);
            delete yerlesmeyenListesi[3].ust[index];
          }
        }
      }
    }

    let yerlesmeyenUcAltLength = yerlesmeyenListesi[3].alt.length;

    if (yerlesmeyenUcAltLength > 0) {
      if (ust3length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust3length;

        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcAltLength -= ust3length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].alt[index] === undefined) break;
            yerlesmeyenUcUstLength--;
            yerlesmeyenListesi[3].alt[index].konum = "3-alt";
            yerlesmeyenListesi[3].alt[index].firinId = firin3ust;
            normalFırınListesi[3].ust.push(yerlesmeyenListesi[3].alt[index]);
            delete yerlesmeyenListesi[3].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenUcAltLength > 0) {
      if (ust2length < 17) {
        let eklenebilecekElemanSayisi = 17 - ust2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcAltLength -= ust2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].alt[index] === undefined) break;
            yerlesmeyenUcUstLength--;
            yerlesmeyenListesi[3].alt[index].konum = "3-alt";
            yerlesmeyenListesi[3].alt[index].firinId = firin2ust;
            normalFırınListesi[2].ust.push(yerlesmeyenListesi[3].alt[index]);
            delete yerlesmeyenListesi[3].alt[index];
          }
        }
      }
    }
    if (yerlesmeyenUcAltLength > 0) {
      if (alt2length < 17) {
        let eklenebilecekElemanSayisi = 17 - alt2length;
        if (eklenebilecekElemanSayisi > 0) {
          yerlesmeyenUcAltLength -= alt2length;
          for (let index = 0; index < eklenebilecekElemanSayisi; index++) {
            if (yerlesmeyenListesi[3].alt[index] === undefined) break;
            yerlesmeyenUcUstLength--;
            yerlesmeyenListesi[3].alt[index].konum = "3-alt";
            yerlesmeyenListesi[3].alt[index].firinId = firin2alt;
            normalFırınListesi[2].alt.push(yerlesmeyenListesi[3].alt[index]);
            delete yerlesmeyenListesi[3].alt[index];
          }
        }
      }
    }
  }

  await JobGroup.update(
    { normalFırınGrubuOlusturulduMu: true },
    {
      where: {
        id: jobGroupId,
      },
    }
  );
  for (const firinSira of Object.keys(normalFırınListesi)) {
    for (const firinKonum of ["alt", "ust"]) {
      if (normalFırınListesi[firinSira][firinKonum].length > 0) {
        normalFırınListesi[firinSira][firinKonum].forEach(async (firin) => {
          await Tree.update(
            {
              treeId: firin.treeId,
              yerlestigiFirin: firin.firinId,
              fırınId: firin.firinId,
              yerlesmesiGerekenFirin: firin?.konum,
            },
            {
              where: {
                treeId: firin.treeId,
              },
            }
          );
        });
      }
    }
  }

  return res
    .status(200)
    .send({ jobGroup, normalFırınListesi, yerlesmeyenListesi });
}

module.exports = normalFırınla;
