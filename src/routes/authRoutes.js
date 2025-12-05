
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
<<<<<<< HEAD
const authMiddleware = require('../middleware/auth');
=======
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c


router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
<<<<<<< HEAD
router.get('/verify', authMiddleware.verifyToken, authController.verifyToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
=======
>>>>>>> e288fa6c41d843b28eca71eb9028e4c97dc6b26c

module.exports = router;