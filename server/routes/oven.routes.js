var express = require("express");
const normalFırınla = require("../controllers/oven/normalFırınla");
const erkenFırınla = require("../controllers/oven/erkenFırınla");
const queryFirinListesi = require("../controllers/oven/queryFirinListesi");
const firinTemizle = require("../controllers/oven/firinTemizle");
const firinListesindenCikar = require("../controllers/oven/firinListesindenCikar");
const router = express.Router();

router.post("/normal", normalFırınla);
router.post("/erken", erkenFırınla);
router.post("/query", queryFirinListesi);
router.post("/clear", firinTemizle);
router.post("/firinListesindenCikar", firinListesindenCikar);

module.exports = router;
