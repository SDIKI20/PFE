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

const changeStat = async (req, res) => {
  try {
    const { uid, rid, status } = req.body;

    if (!uid || !rid) return res.status(400).json({ error: "ID's required" });

    await pool.query(`UPDATE rentals SET status = $3 WHERE user_id = $1 AND id = $2;`, [uid, rid, status]);

    res.json({ message: "Record status updated" });
} catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
}
}

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

const removeOrder = async (req, res) => {
  try {
    const { rid } = req.body;
    if (!rid) return res.status(400).json({ error: "ID required" });
    await pool.query(`DELETE FROM rentals WHERE id = $1`, [rid]);
    res.json({ message: "Record deleted" });
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
  changeStat,
  removeOrder
};
  