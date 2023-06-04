var express = require("express");
const normalFırınla = require("../controllers/oven/normalFırınla");
const erkenFırınla = require("../controllers/oven/erkenFırınla");
const queryFirinListesi = require("../controllers/oven/queryFirinListesi");
const router = express.Router();

router.post("/normal", normalFırınla);
router.post("/erken", erkenFırınla);
router.post("/query", queryFirinListesi);

module.exports = router;
