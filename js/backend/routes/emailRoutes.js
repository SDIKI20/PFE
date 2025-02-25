const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/send-login-link', emailController.sendLoginLink);
router.get('/verify-token', emailController.verifyToken);

module.exports = router;
