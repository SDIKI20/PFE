const pool = require("../models/userModel");
// Update phone status
const confirmPhone = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ error: "User ID is required" });

        await pool.query(`UPDATE users SET phone_status = TRUE WHERE id = $1;`, [id]);

        res.json({ message: "Phone Verified" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Update account status
const confirmAccount = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ error: "User ID is required" });

        await pool.query(`UPDATE users SET account_status = TRUE WHERE id = $1;`, [id]);

        res.json({ message: "Account Verified" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Check phone
const checkPhone = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) return res.status(400).json({ error: "User ID is required" });

        const users = await pool.query("SELECT phone_status FROM users WHERE id = $1", [id]);

        if (users.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ phone_status: users.rows[0].phone_status });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Check AccountStat
const checkAccountStat = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) return res.status(400).json({ error: "User ID is required" });

        const users = await pool.query("SELECT account_status FROM users WHERE id = $1", [id]);

        if (users.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ account_status: users.rows[0].account_status });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Get All Users
const getUsers = async (req, res) => {
    try {
        const users = await pool.query("SELECT * FROM users");
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { 
    getUsers,
    confirmPhone, 
    checkPhone,
    checkAccountStat,
    confirmAccount
};