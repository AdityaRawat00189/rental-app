const Item = require('../models/Item');
const Booking = require('../models/Booking');

const createBooking = async(req, res) => {
    try {
        const {itemId, startDate, endDate} = req.body();
        
        const item = await Item.findById(itemId);

        // 1. Check if item exists or not
        if(!item){
            return res.status(404).json({message: "Item not found"});
        }
        // 2. Check item is Available or not
        if(item.isAvailable === false || item.status !== 'Available') {
            return res.status(400).json({message : "Item is not available for booking"})
        }
        // 3. Owner and Render are not same 
        if(item.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({message: "You cannot rent your own listed item"})
        }
        // 4. Price Calculation
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = end - start;
        // 4.1 Check minimum 1 Day 
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        if((end-start) < oneDay) {
            return res.status(400).json({message: "Minimum Time to rent is 1 day"})
        }


        // 3. Create a booking
        const booking = await Booking.create({
            item: itemId,
            renter: req.user._id,
            owner: item.owner,
            startDate,
            endDate,
        })
       
        // Change the item status when it gets accepted by the owner
        
        console.log("booking...")

        return res.status(201).json({
            message : "Booking created successfully",
            booking,
        })
    } catch (error) {
        res.status(500).json({message: "Request Failed", error: error.message});
    }
}

module.exports  = {
    createBooking,
}