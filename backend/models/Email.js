const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    otpExpires: {
        type: Date,
        required: true,
    },

})

module.exports = mongoose.model('Email',emailSchema);