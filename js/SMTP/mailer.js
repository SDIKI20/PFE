const nodemailer = require('../../lib/node_modules/nodemailer');

// Create a reusable transporter object
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send an email
 * @param {string} to - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} message - Email body (HTML or plain text)
 * @returns {Promise} - Resolves when the email is sent
 */

const sendEmail = async (to, subject, message) => {
    try {
        const mailOptions = {
            from: 'noreply.dzrentalcar@gmail.com',
            to: to,
            subject: subject,
            html: message // Use HTML for formatted emails
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};

