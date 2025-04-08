const { pool } = require("../config/dbConfig");

// Update phone status
const confirmPhone = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ error: "User ID is required" });

        await pool.query(`UPDATE users SET phone_status = TRUE WHERE id = $1;`, [id]);

        res.redirect(`/home`);
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

// Add a vehicle to user favorite
const addFav = async (req, res) => {
    try {
        const { u, v } = req.body;

        if (!u || !v) {
            return res.status(400).json({ error: "Missing user id or vehicle id" });
        }

        // Check if the favorite already exists
        const result = await pool.query(
            "SELECT * FROM favorites WHERE user_id = $1 AND vehicle_id = $2", 
            [parseInt(u), parseInt(v)]
        );

        if (result.rows.length > 0) {
            // If a favorite already exists, return a duplicate message
            return res.status(409).json({ message: "This vehicle is already in the favorites" });
        }

        // Insert the new favorite
        await pool.query(
            "INSERT INTO favorites (user_id, vehicle_id) VALUES ($1, $2)", 
            [parseInt(u), parseInt(v)]
        );
        res.json({ message: "Vehicle added to favorite" });

    } catch (error) {
        console.error("Error adding vehicle:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { 
    getUsers,
    confirmPhone, 
    checkPhone,
    checkAccountStat,
    confirmAccount,
    addFav
};