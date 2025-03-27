const { Pool } = require("pg");
const { pool } = require("../config/dbConfig")


// Get All Orders
const getOrders = async (req, res) => {
    try {
        const orders = await pool.query("SELECT * FROM reservations");
        res.json(orders.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }}
// Store Data in Database
const newOrder = async (req, res) => {
    const { client_id, vehicle_id, start_date, end_date, status,price } = req.body;
try {
    const newOrder = await pool.query(
        
        `INSERT INTO reservations (client_id, vehicle_id, start_date, end_date, status,price) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [client_id, vehicle_id, start_date, end_date, status,price]);
        res.json(newOrder.rows[0]);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
module.exports = { getOrders, newOrder};
