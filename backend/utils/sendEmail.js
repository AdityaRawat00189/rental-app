const nodemailer = require('nodemailer');


const sendEmail = async (options) => {
    console.log('Attempting to send email to:', options.email);
    const transporter = nodemailer.createTransport({
        service: 'gmail', // For Gmail in production
        
        // host: "smtp.mailtrap.io",   // Mailtrap SMTP host
        // port: 2525, // For Mailtrap
        
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },

    });

    const mailOptions = {
       from: 'CampusLink Team <noreply@clgrental.com>',
       to: options.email,
       subject: options.subject,
       text: options.message,
       html: options.html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', options.email);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendEmail;