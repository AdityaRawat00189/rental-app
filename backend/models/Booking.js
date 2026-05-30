const mongoose  = require('mongoose');

const bookingSchema = new mongoose.Schema({
    item : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Item',
        required : true,
    },
    renter : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },

    startDate : { // Pickup date
        type : Date,
        required : true,
    },
    endDate : {  // Return date
        type : Date,
        required : true,
    },
    pickupLocation : {
        type : String,
        required : true,
    },
    returnLocation : {
        type : String,
        required : true,
    },
    pickupTime : {
        type : String,
        required : true,
    },
    returnTime : {
        type : String,
        required : true,
    },
    status : {
        type : String,
        enum : ['Pending','Approved','PickedUp','Returned','Cancelled','Rejected', 'Completed'],
        default : 'Pending',
    },
    paymentStatus : {
        type : String,
        enum : ['Pending','Paid','Failed'],
        default : 'Pending',
    },

    returnVerification: {
        ownerConfirmed: { type: Boolean, default: false },
        renterConfirmed: { type: Boolean, default: false }
    }

},{timestamps: true})

module.exports = mongoose.model('Booking',bookingSchema);