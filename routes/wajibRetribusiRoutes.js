const express = require('express');
const router = express.Router();
const wajibRetribusi = require('../controllers/wajibRetribusiController');
const userMiddleware = require('../middlewares/userMiddleware');
const { validateWajibretribusi } = require('../middlewares/registValidation');

router.post('/tambahWr', userMiddleware, validateWajibretribusi, wajibRetribusi.tambahWajibRetribusi);

module.exports = router;