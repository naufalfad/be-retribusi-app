const express = require('express');
const router = express.Router();
const midtransNotification = require('../controllers/midtransNotificationController');

router.post('midtrans-notification', midtransNotification.handleMidtransNotification);

module.exports = router;