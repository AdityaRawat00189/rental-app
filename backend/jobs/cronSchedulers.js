const cron = require('node-cron');
const pickupAndReturnTasks = require('./PickupAndReturnTasks');

// Schedule the task to run every day at 

function schedulePickupAndReturnTasks() {

    cron.schedule('30 8 * * *', () => {
        console.log('⏰ 8:00 AM reached. Firing pickup & return alerts...');
        pickupAndReturnTasks();
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });
    console.log('⏰ Daily Alerts Cron Initialized.');
}

module.exports = { schedulePickupAndReturnTasks };