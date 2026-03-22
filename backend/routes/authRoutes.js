const express = require('express');
const router = express.Router();

const User = require('../models/User');
const jwt = require('jsonwebtoken');

const {registerUser, verifyOTP, resendOTP, loginUser} = require('../controllers/authController');

// Authentication Routes

router.post('/signup', registerUser);
router.post('/generate-otp',resendOTP);
router.post('/resend-otp', resendOTP)
router.post('/verify-otp',verifyOTP);

router.post('/login',loginUser)


module.exports = router;