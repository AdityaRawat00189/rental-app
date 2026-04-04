const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');

const {updateBookingStatus, dashboard, createBooking} = require("../controllers/bookingController");

// @route POST /api/booking

router.post('/create/:id', protect, createBooking);
router.patch('/status/:id',protect, updateBookingStatus);
router.get('/dashboard', protect, dashboard)

module.exports = router;