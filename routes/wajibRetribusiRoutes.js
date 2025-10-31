const express = require('express');
const router = express.Router();
const wajibRetribusi = require('../controllers/wajibRetribusiController');
const userMiddleware = require('../middlewares/userMiddleware');
const { validateWajibretribusi } = require('../middlewares/registValidation');

router.post('/tambahWr', userMiddleware, validateWajibretribusi, wajibRetribusi.tambahWajibRetribusi);
router.post('/registerWr', validateWajibretribusi, wajibRetribusi.registerWr);
router.get('/getAllWr', wajibRetribusi.getAllWr);
router.get('/tarifWr', wajibRetribusi.getTarif);

module.exports = router;