const express = require('express');
const router = express.Router();
const kategoriRetribusi = require('../controllers/kategoriController')

router.get('/getAllKategori', kategoriRetribusi.getAllKategori);
router.get('/getKategoriByJenis', kategoriRetribusi.getKategoriByJenis);

module.exports = router;