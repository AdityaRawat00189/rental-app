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

    startDate : {
        type : Date,
        required : true,
    },
    endDate : {
        type : Date,
        required : true,
    },

    status : {
        type : String,
        enum : ['Pending','Approved','PickedUp','Returned','Cancelled'],
        default : 'Pending',
    },

},{timestamps: true})

module.exports = mongoose.Schema('Booking',bookingSchema);