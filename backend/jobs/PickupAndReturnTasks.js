const User = require("../models/User");
const Booking = require("../models/Booking");
const Item = require("../models/Item");
const sendEmail = require("../utils/sendEmail");

const buildHtmlTemplate = ({ actionType, recipientName, itemName, targetDate, peerName, peerEmail, dashboardLink }) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eeeeee;">
        
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #F2B82E;">
            <h2 style="color: #333333; margin: 0;">CampusLink</h2>
        </div>

        <div style="padding: 30px 20px; background-color: #ffffff; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #333333; margin-bottom: 20px; text-align: center;">Upcoming ${actionType} Reminder</h3>
            
            <p style="color: #666666; font-size: 16px; margin-bottom: 20px; line-height: 1.5;">
                Hi <strong>${recipientName}</strong>,
            </p>
            
            <p style="color: #666666; font-size: 16px; margin-bottom: 25px; line-height: 1.5;">
                This is a quick reminder that your scheduled <strong>${actionType.toLowerCase()}</strong> is coming up in exactly 2 days. Here are the details for your transaction:
            </p>

            <div style="background-color: #fafafa; border: 1px solid #eeeeee; border-left: 4px solid #F2B82E; border-radius: 4px; padding: 15px; margin-bottom: 25px;">
                <p style="color: #333333; font-size: 15px; margin: 8px 0;"><strong>Item:</strong> ${itemName}</p>
                <p style="color: #333333; font-size: 15px; margin: 8px 0;"><strong>Date:</strong> ${targetDate}</p>
                <p style="color: #333333; font-size: 15px; margin: 8px 0;"><strong>Coordinating with:</strong> ${peerName} (<a href="mailto:${peerEmail}" style="color: #F2B82E; text-decoration: none;">${peerEmail}</a>)</p>
            </div>

            <p style="color: #666666; font-size: 15px; margin-bottom: 30px; line-height: 1.5; text-align: center;">
                Please connect with your peer to ensure a smooth handover.
            </p>

            <div style="text-align: center;">
                <a href="${dashboardLink}" style="background-color: #333333; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">View Dashboard</a>
            </div>
        </div>

        <div style="text-align: center; padding-top: 20px; color: #aaaaaa; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} CampusLink Team. All rights reserved.</p>
            <p style="margin-top: 5px;">You are receiving this because of an active rental request on your account.</p>
        </div>
    </div>
`;

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
            // Because of your awesome schema, we just grab them straight off the booking!
            const borrower = booking.renter;
            const owner = booking.owner;
            const item = booking.item;

            // This line safely skips any "Orphaned Data" from old tests without crashing!
            if (!borrower || !item || !owner) {
                console.warn(`⚠️ Skipping booking ${booking._id}: Missing user or item (Likely deleted test data)`);
                continue; 
            }

            const html = buildHtmlTemplate({
                actionType: 'Pickup',
                recipientName: borrower.name || borrower.email,
                itemName: item.name,
                targetDate: booking.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                peerName: owner.name,
                peerEmail: owner.email,
                dashboardLink: `https://rental-app-virid-three.vercel.app/active-exchange`
            });

            console.log(`✉️ Sending Pickup email for ${borrower.email} regarding "${item.name}"`);
            await sendEmail({
                email: borrower.email,
                subject: 'Action Required: Upcoming Pickup Reminder',
                html
            });
            
            // await sleep(1000); // 1-second pause
        }

    } catch (error) {
        console.error("Error occurred while processing pickup and return tasks:", error);
    }
}

module.exports = pickupAndReturnTasks;