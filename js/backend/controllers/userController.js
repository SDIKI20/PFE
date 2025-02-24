const pool = require("../models/userModel");
const bcrypt = require("bcryptjs");

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

// Add New User
const addUser = async (req, res) => {
    try {
        const { fname, lname, image, email, address, country, wilaya, city, zipcode, phone, birthdate, username, password } = req.body;
        const role = "client"
        // Hash Password & Username
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedUsername = await bcrypt.hash(username, salt); 

        // Store Data in Database
        const newUser = await pool.query(
            `INSERT INTO users (fname, lname, image, email, address, country, wilaya, city, zipcode, phone, birthdate, username, password, role) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
             RETURNING *`,
            [fname, lname, image, email, address, country, wilaya, city, zipcode, phone, birthdate, hashedUsername, hashedPassword, role]
        );

        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { getUsers, addUser };
