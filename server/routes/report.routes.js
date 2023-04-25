var express = require("express");
const madenAyarlamaRaporu = require("../controllers/report/madenAyarlamaRaporu");
const musteriAdetSiraliMadenAyarlamaRaporu = require("../controllers/report/musteriAdetSiraliMadenAyarlamaRaporu");
const musteriSiparisRaporu = require("../controllers/report/musteriSiparisRaporu");

const router = express.Router();

router.get("/madenayarlama", madenAyarlamaRaporu);
router.get("/musteriadetsirali", musteriAdetSiraliMadenAyarlamaRaporu);
router.get("/musterisiparis", musteriSiparisRaporu);

module.exports = router;
