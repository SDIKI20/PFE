const nodemailer = require('../../../lib/node_modules/nodemailer');
const jwt = require('../../../lib/node_modules/jsonwebtoken');

const users = new Map(); // Temporary token store (use a database in production)

// Email sending function
exports.sendLoginLink = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Generate a JWT token (expires in 15 minutes)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '30m' });

    // Store the token temporarily
    users.set(token, { email, expires: Date.now() + 30 * 60 * 1000 });

    // Secure login link
    const loginLink = `http://127.0.0.1:5500/home/signup.html?token=${token}`;

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email message
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Login Link',
        html: `<p>Click <a href="${loginLink}">here</a> to log in. This link is valid for 30 minutes.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Login link sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};

// Token verification function
exports.verifyToken = (req, res) => {
    const { token } = req.query;

    if (!token || !users.has(token)) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ message: 'Token valid', email: decoded.email });
    } catch (error) {
        res.status(400).json({ error: 'Token expired' });
    }
};
