const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    owner: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    category : {
        type : String,
        required : true,
        enum : ['Essentials','Stationery', 'Electronics', 'Lab Gear', 'Books', 'Other'],
    },
    pricePerDay: {
        type : Number,
        required : true,
    },
    securityDeposit : {
        type : Number,
        default : 0,
    },
    images : [{type : String}],
    isAvailable : {
       type : Boolean,
       default : true,
    },
    status : {
        type : String,
        required : true,
        enum : ['Available','Booked','Under Maintenance','Hidden'],
        default : 'Available',
    },

},{timestamps: true})


module.exports = mongoose.model('Item', itemSchema);