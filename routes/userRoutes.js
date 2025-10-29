const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRegister, validateWajibretribusi } = require('../middlewares/registValidation');

router.post('/registerAdmin', validateRegister, userController.registerAdmin);
router.post('/loginAdmin', userController.loginAdmin);
router.post('/registerWr', validateWajibretribusi, userController.registerWr);
router.post('/loginWr', userController.loginWr);
router.post('/verifyOtp', userController.verifyOtp);

module.exports = router;