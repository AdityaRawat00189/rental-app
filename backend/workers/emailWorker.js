const { Worker } = require('bullmq');
const { notificationQueue, redisConnection } = require('../queues/emailQueue');
const sendEmail = require('../utils/sendEmail');
const { buildOtpTemplate, buildPickupTemplate, buildReturnTemplate } = require('../utils/emailTemplates');


const emailWorker = new Worker('notificationQueue', async job => {

    if(job.name === 'send-otp') {
        console.log(`[Worker - URGENT] Sending OTP to ${job.data.email}`);
        const { email, otpCode } = job.data;
        const htmlContent = buildOtpTemplate(otpCode);

        await sendEmail({
            email: job.data.email,
            subject: `${job.data.otpCode} is your CampusLink verification code`,
            html: htmlContent
        });
    }

    else if (job.name === 'send-reminder') {
        console.log(`[Worker] Generating ${job.data.actionType} email for ${job.data.email}`);
        const { actionType, email, recipientName, itemName, targetDate, peerName, peerEmail, dashboardLink } = job.data;

        if(actionType === 'Pickup') {
            const htmlContent = buildPickupTemplate({ recipientName, itemName, targetDate, peerName, peerEmail, dashboardLink });

            await sendEmail({
                email,
                subject: `Reminder: Your pickup for "${itemName}" is scheduled!`,
                html: htmlContent
            });
        }
        else if(actionType === 'Return') {
            const htmlContent = buildReturnTemplate({ recipientName, itemName, targetDate, peerName, peerEmail, dashboardLink });

            await sendEmail({
                email,
                subject: `Reminder: Your return for "${itemName}" is due soon!`,
                html: htmlContent
            })
        }
    }
}, {
    connection: redisConnection,
    concurrency: 3,
})

emailWorker.on('completed', job => {
    console.log(`✅ Job ${job.name} successfully processed for ${job.data.email}`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job.name} failed for ${job.data.email}:`, err.message);
});

module.exports = emailWorker;