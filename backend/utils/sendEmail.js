const nodemailer = require('nodemailer');


const sendEmail = async (options) => {
    console.log('Attempting to send email to:', options.email);
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail', // For Gmail in production
        
    //     // host: "smtp.mailtrap.io",   // Mailtrap SMTP host
    //     // port: 2525, // For Mailtrap
        
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASS,
    //     },

    // });
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     secure: true, // Use SSL
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASS,
    //     },
    //     tls: {
    //         // This is crucial for cloud servers to prevent SSL routing hangups
    //         rejectUnauthorized: false 
    //     },
    //     // Force Node to wait longer for the cloud network handshake
    //     connectionTimeout: 20000, 
    //     socketTimeout: 20000,
    // });
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            // This is crucial for cloud servers to prevent SSL routing hangups
            rejectUnauthorized: false 
        },
        // Force Node to wait longer for the cloud network handshake
        connectionTimeout: 20000, 
        socketTimeout: 20000,
        
        // 👉 ADD THIS EXACT LINE:
        family: 4 
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
