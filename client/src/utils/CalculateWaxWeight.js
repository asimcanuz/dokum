const calculateWaxWeight = (mineralWeight, ayar, renk) => {
  if (mineralWeight === null || Number(mineralWeight) === 0) {
    return 0;
  }
  let _ayar = ayar.toLowerCase();
  let _renk = renk.toLowerCase();

  if (_ayar === "22 ayar") {
    return mineralWeight * 18;
  } else if (_ayar === "21 ayar") {
    return mineralWeight * 18;
  } else if (_ayar === "18 ayar") {
    if (_renk === "yeşil") {
      return mineralWeight * 16;
    } else {
      return mineralWeight * 15 + 20;
    }
  } else if (_ayar === "14 ayar") {
    if (_renk === "yeşil") {
      return mineralWeight * 14;
    } else {
      return mineralWeight * 13 + 20;
    }
  } else if (_ayar === "10 ayar") {
    return mineralWeight * 12;
  } else if (_ayar === "8 ayar" || _ayar === "8 ayar") {
    if (_renk === "yeşil") {
      return mineralWeight * 10;
    } else {
      return mineralWeight * 11.5 + 10;
    }
  } else if (_ayar === "9 ayar" || _ayar === "9 ayar") {
    if (_renk === "yeşil") {
      return mineralWeight * 10;
    } else {
      return mineralWeight * 11.5 + 10;
    }
  } else if (ayar === "gümüş") {
    return mineralWeight * 11;
  } else if (ayar === "bronz") {
    return mineralWeight * 10;
  } else {
    return "Formül Yok";
  }
};

export default calculateWaxWeight;
