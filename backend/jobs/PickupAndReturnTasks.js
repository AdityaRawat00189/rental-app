const User = require("../models/User");
const Booking = require("../models/Booking");
const Item = require("../models/Item");
const sendEmail = require("../utils/sendEmail");

const { notificationQueue } = require("../queues/emailQueue");


function getDayRange(daysAhead = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

const pickupAndReturnTasks = async () => {
    try {
        const { start, end } = getDayRange(2); // 2 days ahead 

        // 1. Fetch EVERYTHING much more cleanly
        const [upcomingPickups, upcomingReturns] = await Promise.all([
            Booking.find({
                startDate: { $gte: start, $lte: end },
                status: 'Approved' 
            })
            .populate('renter') // Populates borrower
            .populate('owner')  // Populates lender directly!
            .populate('item'),  // Populates the item directly!
            
            Booking.find({
                endDate: { $gte: start, $lte: end },
                status: 'PickedUp' 
            })
            .populate('renter')
            .populate('owner')
            .populate('item')
        ]);
        
        // 2. Process Pickups 
        for (const booking of upcomingPickups) {
            
            const borrower = booking.renter;
            const owner = booking.owner;
            const item = booking.item;

            // This line safely skips any "Orphaned Data" from old tests without crashing!
            if (!borrower || !item || !owner) {
                console.warn(`⚠️ Skipping booking ${booking._id}: Missing user or item (Likely deleted test data)`);
                continue; 
            }

            await notificationQueue.add('send-reminder',{
                actionType: 'Pickup',
                email: borrower.email,
                recipientName: borrower.name || borrower.email,
                itemName: item.name,
                targetDate: booking.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                peerName: owner.name,
                peerEmail: owner.email,
                dashboardLink: `https://rental-app-virid-three.vercel.app/active-exchange`
            }, {
                priority: 10,
            });

            console.log(`✉️ Sending Pickup email for ${borrower.email} regarding "${item.name}"`);

            for (const booking of upcomingReturns) {
                 const borrower = booking.renter;
                const owner = booking.owner;
                const item = booking.item;

                // This line safely skips any "Orphaned Data" from old tests without crashing!
                if (!borrower || !item || !owner) {
                    console.warn(`⚠️ Skipping booking ${booking._id}: Missing user or item (Likely deleted test data)`);
                    continue; 
                }

                await notificationQueue.add('send-reminder',{
                    actionType: 'Return',
                    email: borrower.email,
                    recipientName: borrower.name || borrower.email,
                    itemName: item.name,
                    targetDate: booking.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    peerName: owner.name,
                    peerEmail: owner.email,
                    dashboardLink: `https://rental-app-virid-three.vercel.app/active-exchange`
                }, {
                    priority: 10,
                })
            }
            
        }

    } catch (error) {
        console.error("Error occurred while processing pickup and return tasks:", error);
    }
}

module.exports = pickupAndReturnTasks;