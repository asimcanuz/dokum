var express = require("express");
const normalFırınla = require("../controllers/oven/normalFırınla");
const erkenFırınla = require("../controllers/oven/erkenFırınla");
const queryFirinListesi = require("../controllers/oven/queryFirinListesi");
const firinTemizle = require("../controllers/oven/firinTemizle");
const router = express.Router();

router.post("/normal", normalFırınla);
router.post("/erken", erkenFırınla);
router.post("/query", queryFirinListesi);
router.post("/clear", firinTemizle);

module.exports = router;
