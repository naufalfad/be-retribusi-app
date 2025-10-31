const express = require('express');
const router = express.Router();
const jenisRetribusi = require('../controllers/jenisController');

router.get('/getAllJenis', jenisRetribusi.getAllJenis);

module.exports = router;