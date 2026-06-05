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

    totalPrice : {
        total :{ type: Number, default: 0 },
        securityDeposit : { type: Number, default: 0 },
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
        status : {
            type : String,
            enum : ['Pending','Paid','Failed'],
            default : 'Pending',
        },
        ownerConfirmed: { type: Boolean, default: false },
        renterConfirmed: { type: Boolean, default: false }
    },

    returnVerification: {
        ownerConfirmed: { type: Boolean, default: false },
        renterConfirmed: { type: Boolean, default: false }
    }

},{timestamps: true})

module.exports = mongoose.model('Booking',bookingSchema);