// utils/emailTemplates.js

// 1. OTP Verification Theme (Minimalist, High Security Focus)
const buildOtpTemplate = (otpCode) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F4F6; -webkit-font-smoothing: antialiased;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="padding: 40px; text-align: center;">
                <div style="font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.5px; margin-bottom: 30px;">Campus<span style="color: #F2B82E;">Link</span></div>
                
                <h1 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #111827;">Secure Authentication</h1>
                <p style="margin: 0 0 30px 0; font-size: 15px; color: #6B7280; line-height: 1.6;">Please use the verification code below to sign in. This code is valid for 10 minutes.</p>
                
                <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #0F172A;">${otpCode}</span>
                </div>
                
                <p style="margin: 0; font-size: 13px; color: #9CA3AF;">If you didn't request this email, there's nothing to worry about &mdash; you can safely ignore it.</p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0; font-size: 12px; color: #9CA3AF;">&copy; ${new Date().getFullYear()} CampusLink. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// 2. Pickup Theme (Emerald Green Status Badge, Clean Card UI)
const buildPickupTemplate = ({ recipientName, itemName, targetDate, peerName, peerEmail, dashboardLink }) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F4F6; -webkit-font-smoothing: antialiased;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="padding: 40px;">
                <div style="font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.5px; margin-bottom: 30px; text-align: center;">Campus<span style="color: #F2B82E;">Link</span></div>
                
                <div style="display: inline-block; background-color: #ECFDF5; color: #059669; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px;">Upcoming Pickup</div>
                
                <h1 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 600; color: #111827;">Ready to meet up?</h1>
                <p style="margin: 0 0 25px 0; font-size: 16px; color: #4B5563; line-height: 1.6;">Hi <strong>${recipientName}</strong>,<br>This is a quick reminder that your scheduled pickup is happening in exactly 2 days.</p>
                
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; margin-bottom: 30px;">
                    <tr>
                        <td style="padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding-bottom: 12px;"><span style="font-size: 13px; color: #64748B; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Item</span><br><span style="font-size: 16px; color: #0F172A; font-weight: 500;">${itemName}</span></td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 12px; border-top: 1px solid #E2E8F0; padding-top: 12px;"><span style="font-size: 13px; color: #64748B; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Date</span><br><span style="font-size: 16px; color: #0F172A; font-weight: 500;">${targetDate}</span></td>
                                </tr>
                                <tr>
                                    <td style="border-top: 1px solid #E2E8F0; padding-top: 12px;"><span style="font-size: 13px; color: #64748B; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Coordinating With</span><br><span style="font-size: 16px; color: #0F172A; font-weight: 500;">${peerName}</span><br><a href="mailto:${peerEmail}" style="color: #4F46E5; text-decoration: none; font-size: 14px;">${peerEmail}</a></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center">
                            <a href="${dashboardLink}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">View Exchange Details</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0; font-size: 12px; color: #9CA3AF;">&copy; ${new Date().getFullYear()} CampusLink. You are receiving this because of an active rental request.</p>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// 3. Return Theme (Amber/Orange Status Badge for Urgency)
const buildReturnTemplate = ({ recipientName, itemName, targetDate, peerName, peerEmail, dashboardLink }) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F4F6; -webkit-font-smoothing: antialiased;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="padding: 40px;">
                <div style="font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.5px; margin-bottom: 30px; text-align: center;">Campus<span style="color: #F2B82E;">Link</span></div>
                
                <div style="display: inline-block; background-color: #FFFBEB; color: #D97706; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px;">Return Deadline</div>
                
                <h1 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 600; color: #111827;">Action Required</h1>
                <p style="margin: 0 0 25px 0; font-size: 16px; color: #4B5563; line-height: 1.6;">Hi <strong>${recipientName}</strong>,<br>Your rental period is almost over. Please arrange to return the item in exactly 2 days.</p>
                
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; margin-bottom: 30px;">
                    <tr>
                        <td style="padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding-bottom: 12px;"><span style="font-size: 13px; color: #64748B; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Item</span><br><span style="font-size: 16px; color: #0F172A; font-weight: 500;">${itemName}</span></td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 12px; border-top: 1px solid #E2E8F0; padding-top: 12px;"><span style="font-size: 13px; color: #64748B; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Return By</span><br><span style="font-size: 16px; color: #D97706; font-weight: 600;">${targetDate}</span></td>
                                </tr>
                                <tr>
                                    <td style="border-top: 1px solid #E2E8F0; padding-top: 12px;"><span style="font-size: 13px; color: #64748B; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Owner Details</span><br><span style="font-size: 16px; color: #0F172A; font-weight: 500;">${peerName}</span><br><a href="mailto:${peerEmail}" style="color: #4F46E5; text-decoration: none; font-size: 14px;">${peerEmail}</a></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center">
                            <a href="${dashboardLink}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">Arrange Return</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0; font-size: 12px; color: #9CA3AF;">&copy; ${new Date().getFullYear()} CampusLink. You are receiving this because of an active rental request.</p>
            </td>
        </tr>
    </table>
</body>
</html>
`;

module.exports = {
    buildOtpTemplate,
    buildPickupTemplate,
    buildReturnTemplate
};