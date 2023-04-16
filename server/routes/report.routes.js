var express = require("express");
const madenAyarlamaRaporu = require("../controllers/report/madenAyarlamaRaporu");

const router = express.Router();

router.get("/madenayarlama", madenAyarlamaRaporu);

module.exports = router;
