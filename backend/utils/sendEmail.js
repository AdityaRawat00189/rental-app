const nodemailer = require('nodemailer');


const sendEmail = async (options) => {
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
       from: 'College Rental Team <noreply@clgrental.com>',
       to: options.email,
       subject: options.subject,
       text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;