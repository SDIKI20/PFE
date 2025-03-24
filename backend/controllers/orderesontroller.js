const { Pool } = require("pg");
const pool = require("../models/ordermodel");


// Get All Orders
const getOrders = async (req, res) => {
    try {
        const users = await pool.query("SELECT * FROM reservations");
        res.json(users.reservations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
// Store Data in Database
try {
    const newOrder = await pool.query(
        
        `INSERT INTO reservations (client_id, vehicle_id, start_date, end_date, status, reservation_date) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [client_id, vehicle_id, start_date, end_date, status, reservation_date]);
        res.json(newOrder.rows[0]);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
module.exports = { getOrders, newOrder};
