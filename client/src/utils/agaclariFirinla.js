import { firinlarConstants } from '../constants/firinlarConstants';
// TODO : ağaçları firinlara aktardım bazılarında hata olabilir. kontrol et. 17 den fazla ağaç varsa diğer firinlara aktarma işleminden devam et

export const agaclariFirinla = (trees, erkenGrupAcik, setTrees, checkedGroup) => {
  var { newTree, firinListesi } = firinla(trees, erkenGrupAcik, checkedGroup);

  // newTree ve firinListesi karşılaştır
  //

  setTrees(newTree);
  return firinListesi;
};

const firinla = (trees, erkenGrupAcik, checkedGroup) => {
  let firinListesi = {
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

  let newTree = trees.map((element) => {
    const { color, option, thick } = element;
    const { colorName: agacRenk } = color;
    const { optionText: agacAyar } = option;
    const { thickName: agacKalinlik } = thick;
    //
    let i = erkenGrupAcik ? 2 : 1;
    for (i; i <= 3; i++) {
      if (checkedGroup === 'erken' && i > 1) {
        continue;
      }
      const category = firinlarConstants[i];
      for (const konum of ['ust', 'alt']) {
        for (const type of category[konum]) {
          const { kalinlik, renk, ayar } = type;
          if (
            (ayar === agacAyar || ayar === 'Hepsi') &&
            (renk === agacRenk || renk === 'Hepsi') &&
            (kalinlik === agacKalinlik || kalinlik === 'Hepsi') &&
            (element.yerlestigiFirin === undefined || element.yerlestigiFirin === null)
          ) {
            if (firinListesi[i][konum].length < 17) {
              if (i === 1 && checkedGroup === 'erken') {
                element.erkenFirinGrubunaEklendiMi = true;
              }
              if (checkedGroup === 'normal') {
                element.erkenFirinGrubunaEklendiMi = false;
              }
              if (firinListesi[i][konum].length - 1 < 13) {
                element.yerlestigiFirin = `${i}-${konum}`;
                element.konum = `-`;
              } else if (firinListesi[i][konum].length - 1 >= 13) {
                element.yerlestigiFirin = `${i}-${konum} iç`;
                element.konum = 'iç';
              }
              firinListesi[i][konum].push(element);
            } else {
              continue;
            }
          }
        }
      }
    }
    return element;
  });

  return { newTree, firinListesi };
};
