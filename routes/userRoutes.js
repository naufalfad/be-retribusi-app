const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRegister } = require('../middlewares/registValidation');

router.post('/registerAdmin', validateRegister, userController.registerAdmin);
router.post('/loginAdmin', userController.loginAdmin);
router.post('/loginWr', userController.loginWr);
router.post('/verifyOtp', userController.verifyOtp);

module.exports = router;