const { Pool } = require("pg");
const pool = require("../models/ordermodel");


// Get All Orders
const getOrders = async (req, res) => {
    try {
        const orders = await pool.query("SELECT * FROM reservations");
        res.json(orders.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
// Store Data in Database
try {
    const newOrder = await pool.query(
        
        `INSERT INTO reservations (client_id, vehicle_id, start_date, end_date, status,price) 
             VALUES ($1, $2, $3, $4, $5) 
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
