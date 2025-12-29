const express = require('express');
const router = express.Router();
const skrdController = require('../controllers/skrdController');

router.post('/generateSKRD', skrdController.generateSKRD);

module.exports = router;