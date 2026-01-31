const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware'); // ✅ ADD THIS

router.post('/register', authController.register);
router.post('/login', authController.login);

// ✅ PROFILE ROUTES (PROTECTED)
router.get('/me', authMiddleware, authController.me);
router.put('/me', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
