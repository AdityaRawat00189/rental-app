const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');

const {updateBookingStatus, updatePaymentStatus, dashboard, createBooking, updateBookingCompletion} = require("../controllers/bookingController");

// @route POST /api/booking

router.post('/create/:id', protect, createBooking);
router.patch('/status/:id',protect, updateBookingStatus);
router.get('/dashboard', protect, dashboard)
router.patch('/payment/:id', protect, updatePaymentStatus)
router.patch('/completion/:id', protect, updateBookingCompletion)
module.exports = router;