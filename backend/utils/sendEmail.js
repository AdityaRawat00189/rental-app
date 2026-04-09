require('dotenv').config();

const sendEmail = async (options) => {
    console.log('Attempting to send email via Brevo to:', options.email);

    // 1. Prepare the email data
    const payload = {
        sender: {
            name: "CampusLink Team",
            // MUST be the exact Gmail address you verified in Brevo Step 2
            email: process.env.EMAIL_USER 
        },
        to: [
            {
                email: options.email // The user receiving the OTP
            }
        ],
        subject: options.subject,
        htmlContent: options.html || `<p>${options.message}</p>`
    };

    // 2. Send the request to Brevo's HTTP API
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // 3. Handle errors if Brevo rejects it
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Brevo API Error:', errorData);
            throw new Error('Failed to send email via Brevo');
        }

        // 4. Success!
        const data = await response.json();
        console.log('Email sent successfully via Brevo API! Message ID:', data.messageId);
        
    } catch (error) {
        console.error('Error in sendEmail function:', error.message);
    }
};

module.exports = sendEmail;