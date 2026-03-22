const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');

const {createBooking} = require("../controllers/bookingController");

// @route POST /api/booking

router.post('/create',protect, createBooking);

module.exports = router;