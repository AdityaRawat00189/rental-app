const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    password : {
        type: String,
        required: true,
        // validate: {
        //     validator: function(v) {
        //         return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(v) && v.length >= 8;
        //     },
        //     message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'

        // }
    },
    collegeName : {
        type : String,
        required: true,
    },
    hostel : {
        type: String,
        required: true,
    },
    roomNumber: {
        type: String,
    },
    // Optional at signup, required before listing/renting
    phoneNumber: {
        type: String,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },


    // To verify whether email is fake or not
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    }

},{timestamps: true})

// Hash Password before saving
// userSchema.pre('save', async function(next) {
//     if(!this.isModified('password')) return next();

//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (error) {
//         next(error);
//     }
// })
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


module.exports = mongoose.model('User',userSchema);