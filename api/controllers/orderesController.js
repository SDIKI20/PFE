const { pool } = require("../config/dbConfig")

const getOrders = async (req, res) => {
    try {
      const orders = await pool.query("SELECT * FROM rentals;");
      res.json(orders.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  };
  
  const getPendingOrders = async (req, res) => {
    try {
      const orders = await pool.query("SELECT * FROM rentals WHERE status = 'pending';");
      res.json(orders.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  };
  
  const getCompletedOrders = async (req, res) => {
    try {
      const orders = await pool.query("SELECT * FROM rentals WHERE status = 'completed';");
      res.json(orders.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  };
  
  const getCanceledOrders = async (req, res) => {
    try {
      const orders = await pool.query("SELECT * FROM rentals WHERE status = 'canceled';");
      res.json(orders.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  };
  
  const getActiveOrders = async (req, res) => {
    try {
      const orders = await pool.query("SELECT * FROM rentals WHERE status = 'active';");
      res.json(orders.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  };
  
  module.exports = {
    getOrders,
    getPendingOrders,
    getCompletedOrders,
    getCanceledOrders,
    getActiveOrders,
  };
  