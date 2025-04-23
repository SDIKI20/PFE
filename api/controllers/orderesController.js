const { pool } = require("../config/dbConfig")

const getOrders = async (req, res) => {
  try {
    const { limit = 5, offset = 0, order = "id", dire = "DESC" } = req.query;

    const allowedOrders = ['id', 'created_at']; 
    const allowedDirections = ['ASC', 'DESC'];

    const safeOrder = allowedOrders.includes(order) ? order : 'id';
    const safeDire = allowedDirections.includes(dire.toUpperCase()) ? dire.toUpperCase() : 'DESC';

    const countResult = await pool.query(`
      SELECT  count(r.id)
      FROM
        rentals r
          JOIN users u ON u.id = r.user_id
          JOIN vehicles v ON v.id = r.vehicle_id
          JOIN brands b ON b.id = v.brand_id
          JOIN vehicle_stock vs ON vs.vehicle_id = v.id
          JOIN office o ON o.id = vs.office_id
    `);

    const total = parseInt(countResult.rows[0].count, 10);

    const result = await pool.query(
      `
        SELECT  r.*,
            u.username,
            v.model, v.fab_year,
            b.name AS brand_name,
            o.country, o.wilaya, o.city, o.address
          FROM
            rentals r
            JOIN users u ON u.id = r.user_id
            JOIN vehicles v ON v.id = r.vehicle_id
            JOIN brands b ON b.id = v.brand_id
            JOIN vehicle_stock vs ON vs.vehicle_id = v.id
            JOIN office o ON o.id = vs.office_id
        ORDER BY r.${safeOrder} ${safeDire}
        LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    res.status(200).json({
      total,
      orders: result.rows
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  