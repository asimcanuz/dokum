import { firinlarConstants } from '../constants/firinlarConstants';
// TODO : ağaçları firinlara aktardım bazılarında hata olabilir. kontrol et. 17 den fazla ağaç varsa diğer firinlara aktarma işleminden devam et
export const agaclariFirinla = (trees, checkedGroup) => {
  let _firin = {
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
  let acikKalanAgaclar = [];

  if (checkedGroup === 'normal') {
    trees.forEach((element) => {
      const { treeNo, erkenFirinGrubunaEklendiMi, color, option, thick } = element;
      const { colorName: renk } = color;
      const { optionText: ayar } = option;
      const { thickName: kalinlik } = thick;

      // Önceden tanımlanmış kategorilerin sayısı
      const categoryCount = Object.keys(firinlarConstants).length;

      // Döngülerle her bir kategori için kontrol yapma
      for (let i = 1; i <= categoryCount; i++) {
        const category = firinlarConstants[i]; // 1,2,3
        const keys = Object.keys(category); //alt ust

        for (const key of keys) {
          category[key].forEach((firin) => {
            // alt ust
            if (
              (firin.ayar === ayar || firin.ayar === 'Hepsi') &&
              (firin.renk === renk || firin.renk === 'Hepsi') &&
              (firin.kalinlik === kalinlik || firin.kalinlik === 'Hepsi')
            ) {
              _firin[i][key].push(treeNo);
            }
          });
        }
      }
    });

    // hiç bir firin içerisinde yer almayan ağaçları acikKalanAgaclar dizisine aktar.
    trees.forEach((element) => {
      const { treeId, treeNo } = element;
      let isFound = false;

      for (let i = 1; i <= 3; i++) {
        const keys = Object.keys(_firin[i]);

        for (const key of keys) {
          if (_firin[i][key].includes(treeNo)) {
            isFound = true;
            break;
          }
        }
      }
      if (!isFound) {
        acikKalanAgaclar.push(treeId);
      }
    });
  }

  acikKalanAgaclar.forEach((element) => {
    trees.forEach((tree) => {
      if (tree.treeId === element) {
        const { color, option, thick } = tree;
        const { colorName: renk } = color;
        const { optionText: ayar } = option;
        const { thickName: kalınlık } = thick;

        console.log(renk, ayar, kalınlık);
      }
    });
  });
  
  // Firinları kontrol et, bir firinin alt ve üst bolmesinde max 17 ağaç olacak. 17 den fazla ise diğer bolmeye aktar. 13 + 4 iç   -> 17
  // Eğer aktarılan ağaçlar da 17 den fazla ise diğer firina aktar. Bu şekilde butun firinların alt ve ust bolmeleri dolacak.
  // Eğer hepsi doluysa ağaçları acikKalanAgaclar dizisine aktar.
};
