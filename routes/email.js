const express = require('express');
const router = express.Router();
const emailController = require('../controllers/email');

router.post('/receiveEmail', emailController.receiveEmail)

module.exports = router;
