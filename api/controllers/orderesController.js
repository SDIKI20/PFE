const { pool } = require("../config/dbConfig")

// Get All Orders
const getOrders = async (req, res) => {
    try {
        const orders = await pool.query("SELECT * FROM rentals;");
        res.json(orders.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }}
// Store Data in Database
const newOrder = async (req, res) => {
    const { id,user_id, vehicle_id, start_date, end_date,total_price, status,created_at } = req.body;
try {
    const newOrder = await pool.query(
        
        `INSERT INTO rentals (id,user_id, vehicle_id, start_date, end_date,total_price, status,created_at ) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING *`,
            [id,user_id, vehicle_id, start_date, end_date,total_price, status,created_at ]);
        res.json(newOrder.rows[0]);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
module.exports = { getOrders, newOrder};
