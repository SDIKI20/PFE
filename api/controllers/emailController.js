const { pool } = require("../config/dbConfig")
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// ✅ Send Email Message
exports.sendMessage = async (req, res) => {
    const { email } = req.body;
    let { subject, message } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });
    subject = subject || "";
    message = message || "Empty";

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            html: message,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Email sent successfully" });

    } catch (error) {
        console.error("Error sending email:", error.message);
        res.status(500).json({ error: "Failed to send email" });
    }
};

// ✅ Send Login Link
exports.sendLoginLink = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    // Generate a JWT token (expires in 30 minutes)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30m" });
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    try {
        // Store the token in the database
        await pool.query(
            `INSERT INTO user_tokens (email, token, expires_at) VALUES ($1, $2, $3)`,
            [email, token, expiresAt]
        );

        // Generate login link
        const prodUrl = process.env.PROD_URL || `http://localhost:${process.env.PORT}`;
        const loginLink = `${prodUrl}/signup?token=${token}`;

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email message
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Login Link",
            html: `
                  <h1>DZRentCars</h1>
                  <br/>
                  <img src="https://i.ibb.co/NnZVzj1T/logo.png" alt="Picture" width="100" style="margin: 10px 0;" />
                  <br/>
                  <p style="max-width: 500px; margin: 10px 0;">
                      This link will expire in 30 minutes for your security. If you did not create an account or request this verification, please ignore this message.<br><br>
                      If you have any questions or need help, feel free to contact our support team.
                  </p>
                  <br/>
                  <a href="${loginLink}" style="border: none; padding: 0.5em 1em; background-color: orange; color: white; border-radius: 8px; text-decoration: none; margin: 15px 0;">Click Here</a>
                  <br/>
                  <p style="color: red; opacity: 0.6; align-self: flex-start; font-size: 0.8rem; margin-top: 25px;">
                      Do not share this message with anyone.
                  </p>
            `
          };          

        await transporter.sendMail(mailOptions);
        res.json({ message: "Login link sent successfully" });

    } catch (error) {
        console.error("Error sending login link:", error);
        res.status(500).json({ error: "Failed to send login link" });
    }
};

// ✅ Verify Token
exports.verifyToken = async (req, res) => {
    const { token } = req.query;

    if (!token) return res.status(400).json({ error: "Token is required" });

    try {
        // Check if token exists in the database
        const result = await pool.query(
            `SELECT email, expires_at FROM user_tokens WHERE token = $1`,
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        const { email, expires_at } = result.rows[0];

        // Check if token is expired
        if (new Date() > new Date(expires_at)) {
            return res.status(400).json({ error: "Token expired" });
        }

        res.json({ message: "Token valid", email });

    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ Delete Expired Tokens Automatically
const deleteExpiredTokens = async () => {
    try {
        await pool.query(`DELETE FROM user_tokens WHERE expires_at < NOW()`);
        console.log("Expired tokens deleted");
    } catch (error) {
        console.error("Error deleting expired tokens:", error);
    }
};

// Run cleanup every hour
setInterval(deleteExpiredTokens, 60 * 60 * 1000);
