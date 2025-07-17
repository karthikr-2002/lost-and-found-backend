
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (toEmail, subject, message) => {
    const email = {
        to: toEmail,
        from: process.env.FROM_EMAIL,
        subject: subject,
        text: message,
        html: `
                        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="color: #333333;">📬 Someone Wants to Contact You</h2>
                    <p style="font-size: 16px; color: #555555;">Hi there,</p>
                    <p style="font-size: 16px; color: #555555;">
                        A user is trying to reach you regarding an item you posted on the <strong>Lost & Found</strong> platform.
                    </p>
                    
                    <div style="margin: 20px 0; padding: 15px; background-color: #f0f4f8; border-left: 4px solid #007bff;">
                        <p><strong>📞 Phone Number:</strong> ${message.phno}</p>
                        <p><strong>✉️ Email ID:</strong> ${message.emailid}</p>
                    </div>
                    
                    <p style="font-size: 15px; color: #444444;">
                        Please feel free to respond if the information seems relevant.
                    </p>
                    
                    <p style="font-size: 14px; color: #888888; margin-top: 30px;">
                        Thank you,<br/>
                        <strong>Lost & Found Team</strong>
                    </p>
                </div>
            </div>
        `
    };

    try {
        await sgMail.send(email);
        console.log('✅ Email sent successfully');
    } catch (error) {
        console.error('❌ Error sending email:', error?.response?.body || error.message);
    }
};

module.exports = sendMail;
