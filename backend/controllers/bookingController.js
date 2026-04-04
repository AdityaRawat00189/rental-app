const Item = require('../models/Item');
const Booking = require('../models/Booking');

const createBooking = async(req, res) => {
    // console.log("Hit the booking controller");
    try {
        // console.log("Received booking request from user");
        const itemId = req.params.id; // From the URL /create/:id
        const borrowerId = req.user._id;
        const startDate = new Date(); // Assuming rental starts immediately, can be modified to accept from request body
        // console.log("Creating booking for item:", itemId, "by user:", borrowerId)
        const item = await Item.findById(itemId);

        // 1. Check if item exists or not
        if(!item){
            return res.status(404).json({message: "Item not found"});
        }
        // 2. Check item is Available or not
        if(item.isAvailable === false || item.status !== 'Available') {
            return res.status(400).json({message : "Item is not available for booking"})
        }
        // 3. Owner and Render are same or not 
        if(item.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({message: "You cannot rent your own listed item"})
        }
        // 4. Price Calculation
        // const start = new Date(startDate);
        // const end = new Date(endDate);
        // const diff = end - start;
        // // 4.1 Check minimum 1 Day 
        // const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        // if((end-start) < oneDay) {
        //     return res.status(400).json({message: "Minimum Time to rent is 1 day"})
        // }


        // 3. Create a booking
        const booking = await Booking.create({
            item: itemId,
            renter: req.user._id,
            owner: item.owner,
            startDate,
            // endDate,
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

const dashboard = async(req, res) => {
    console.log("Hit the dashboard controller for user:");
    try {
        console.log("Fetching booking requests for user:", req.user._id);
        const user = req.user._id;
        const requests = await Booking.find({
            $or: [
                {renter: user},
                {owner: user}
            ]
        }).populate('item', 'title description price').populate('owner','name email').populate('renter', 'name email');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({message: "Request Failed", error: error.message});
    }
}

const updateBookingStatus = async (req, res) => {
    try {
        // Renamed to bookingId for clarity, since this is a booking ID, not an item ID
        const bookingId = req.params.id; 
        const { status } = req.body;

        // 1. Fetch the booking FIRST
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking record not found" });
        }

        // 2. Fetch the associated item
        const item = await Item.findById(booking.item);
        if (!item) {
            return res.status(404).json({ message: "Associated item not found" });
        }

        // 3. Authorization Check: Ensure the user processing this is the OWNER of the item
        if (item.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: You are not the owner of this item" });
        }

        // 4. State Check: Only process updates on Pending requests
        if (booking.status !== 'Pending') {
            return res.status(400).json({ message: `Cannot update request. Current status is ${booking.status}` });
        }

        // 5. Apply the requested status to the booking
        booking.status = status;

        // 6. Handle side-effects based on the status
        if (status === 'Approved') {
            item.status = 'Booked';

            // IMPORTANT: Automatically reject all OTHER pending bookings for this item
            await Booking.updateMany(
                { 
                    item: item._id, 
                    _id: { $ne: booking._id }, // Exclude the currently approved booking
                    status: 'Pending'          // Only target other pending requests
                },
                { 
                    $set: { status: 'Rejected' } 
                }
            );
        } 
        else if (status === 'Cancelled' || status === 'Returned' || status === 'Rejected') {
            item.status = 'Available';
        }

        // 7. Save both the updated booking and item
        await booking.save();
        await item.save();

        return res.status(200).json({ 
            message: `Booking ${status.toLowerCase()} successfully`, 
            booking 
        });

    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ message: "Request Failed", error: error.message });
    }
}

module.exports  = {
    updateBookingStatus,
    dashboard,
    createBooking,
}