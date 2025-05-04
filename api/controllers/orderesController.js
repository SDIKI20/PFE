const { pool } = require("../config/dbConfig")

const getCounts = async (req, res) => {
  try {

    const countResult = await pool.query(`
      SELECT  
        count(r.id)
      FROM 
        rentals r
    `);
    const pendingCount = await pool.query(`
      SELECT  count(r.id)
      FROM
        rentals r
      WHERE status = 'pending'
    `)
    const activeCount = await pool.query(`
      SELECT  count(r.id)
      FROM
        rentals r
      WHERE status = 'active'
    `)
    const completedCount = await pool.query(`
      SELECT  count(r.id)
      FROM
        rentals r
      WHERE status = 'completed'
    `)
    const canceledCount = await pool.query(`
      SELECT  count(r.id)
      FROM
        rentals r
      WHERE status = 'canceled'
    `)

    res.status(200).json({
      total: parseInt(countResult.rows[0].count),
      pending: parseInt(pendingCount.rows[0].count),
      active: parseInt(activeCount.rows[0].count),
      completed: parseInt(completedCount.rows[0].count),
      canceled: parseInt(canceledCount.rows[0].count)
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const { limit = 5, offset = 0, order = "id", dire = "DESC", status="" } = req.query;

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

    const result = await pool.query(`
        SELECT  r.*,
            u.username,
            u.fname,
            u.lname,
            u.image,
            v.model, v.fab_year, v.image AS vimage, v.rental_type,
            b.name AS brand_name, b.logo,
            o.country, o.wilaya, o.city, o.address
          FROM
            rentals r
            JOIN users u ON u.id = r.user_id
            JOIN vehicles v ON v.id = r.vehicle_id
            JOIN brands b ON b.id = v.brand_id
            JOIN vehicle_stock vs ON vs.vehicle_id = v.id
            JOIN office o ON o.id = vs.office_id
          WHERE status LIKE '%${status}%'
        ORDER BY r.${safeOrder} ${safeDire}
        LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    const pendingCount = await pool.query(`
      SELECT  count(r.id)
      FROM
        rentals r
      WHERE status = 'pending'
    `)
    const activeCount = await pool.query(`
      SELECT  count(r.id)
      FROM
        rentals r
      WHERE status = 'active'
    `)
    const completedCount = await pool.query(`
      SELECT  count(r.id)
      FROM
        rentals r
      WHERE status = 'completed'
    `)

    res.status(200).json({
      total,
      pending: parseInt(pendingCount.rows[0].count),
      active: parseInt(activeCount.rows[0].count),
      completed: parseInt(completedCount.rows[0].count),
      orders: result.rows
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOrdersbyOffice = async (req, res) => {
  try {
    const { limit = 5, offset = 0, order = "id", dire = "DESC" } = req.query;
    const { office } = req.params;

    if(!office) return res.status(400).json({ error: "Office ID is required" });

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

    const result = await pool.query(`
        SELECT  r.*,
            u.username,
            u.fname,
            u.lname,
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
          WHERE vs.office_id = $3
          ORDER BY r.${safeOrder} ${safeDire}
          LIMIT $1 OFFSET $2
      `,
      [limit, offset, office]
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

const getStats = async (req, res) => {
  try {

    const { period = 30, office = null } = req.query

    if(!office){
      const result = await pool.query(`
        SELECT 
          COUNT(r.id) AS returns,
          SUM(r.insurance) AS insurance,
          SUM(r.fees) AS fees,
          SUM(r.total_price) - SUM(r.insurance) AS icomme
        FROM
          rentals r
        WHERE 
          r.status = 'completed'
          AND r.created_at >= CURRENT_DATE - INTERVAL '${period} days'
      `);      
      const result2 = await pool.query(`
          SELECT count(r.id) AS total FROM rentals r WHERE  r.created_at >= CURRENT_DATE - INTERVAL '${period} days'
        `
      );
      res.status(200).json({
        stats: result.rows[0],
        total:result2.rows[0]
      });
    }else{
      const result = await pool.query(`
        SELECT 
          COUNT(r.id) AS returns,
          SUM(r.insurance) AS insurance,
          SUM(r.fees) AS fees,
          SUM(r.total_price) - SUM(r.insurance) AS icomme
        FROM (
          SELECT r.*
          FROM rentals r
          INNER JOIN vehicle_stock vs ON vs.vehicle_id = r.vehicle_id
          WHERE 
            vs.office_id = $1
            AND r.status = 'completed'
            AND r.created_at >= CURRENT_DATE - INTERVAL '${period} days'
        ) r
      `, [office]);

      const result2 = await pool.query(`
        SELECT COUNT(*) AS total
        FROM rentals r
        INNER JOIN vehicle_stock vs ON vs.vehicle_id = r.vehicle_id
        WHERE vs.office_id = $1 AND  r.created_at >= CURRENT_DATE - INTERVAL '${period} days'
      `, [office]);
      
      res.status(200).json({
        stats: result.rows[0],
        total:result2.rows[0]
      });
    }

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getStatsDaily = async (req, res) => {
  try {

    const { period = 7, office = null } = req.query

    if(!office){
      const result = await pool.query(`
        WITH days AS (
          SELECT generate_series(
            CURRENT_DATE - INTERVAL '${period} days', 
            CURRENT_DATE,
            INTERVAL '1 day'
          )::date AS rental_day
        )
        SELECT 
          d.rental_day AS day,
          TO_CHAR(d.rental_day, 'Dy') AS day_name, -- ADD THIS for day name (Sun, Mon, etc)
          COALESCE(SUM(r.total_price + r.insurance + r.fees), 0) AS income,
          COUNT(r.id) AS rentals
        FROM 
          days d
        LEFT JOIN 
          rentals r 
          ON DATE(r.created_at) = d.rental_day 
          AND r.paid = TRUE 
          AND r.status = 'completed'
        GROUP BY 
          d.rental_day
        ORDER BY 
          d.rental_day;
      `);
      res.status(200).json({
        stats: result.rows
      });
    }else{
      const result = await pool.query(`
        WITH days AS (
          SELECT generate_series(
            CURRENT_DATE - INTERVAL '${period} days', 
            CURRENT_DATE,
            INTERVAL '1 day'
          )::date AS rental_day
        )
        SELECT 
          d.rental_day AS day,
          TO_CHAR(d.rental_day, 'Dy') AS day_name,  -- Add day name (Sun, Mon, etc)
          COALESCE(SUM(r.total_price + r.insurance + r.fees), 0) AS income,
          COUNT(r.id) AS rentals
        FROM 
          days d
        LEFT JOIN (
          SELECT r.*
          FROM rentals r
          INNER JOIN vehicle_stock vs ON vs.vehicle_id = r.vehicle_id
          WHERE 
            vs.office_id = $1
            AND r.paid = TRUE
            AND r.status = 'completed'
        ) r
        ON DATE(r.created_at) = d.rental_day
        GROUP BY 
          d.rental_day
        ORDER BY 
          d.rental_day;
      `, [office]);
      res.status(200).json({
        stats: result.rows
      });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getStatsMonthly = async (req, res) => {
  try {

    const { period = 5, office = null } = req.query

    if(!office){
      const result = await pool.query(`
        WITH months AS (
          SELECT generate_series(
            DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '${period} months',
            DATE_TRUNC('month', CURRENT_DATE),
            INTERVAL '1 month'
          )::date AS month_start
        )
        SELECT 
          EXTRACT(MONTH FROM m.month_start)::int AS month_number,
          TO_CHAR(m.month_start, 'Mon') AS month_name,
          COALESCE(SUM(r.total_price + r.insurance + r.fees), 0) AS income,
          COUNT(r.id) AS rentals
        FROM 
          months m
        LEFT JOIN 
          rentals r 
        ON 
          DATE_TRUNC('month', r.created_at) = m.month_start 
          AND r.paid = TRUE 
          AND r.status = 'completed'
        GROUP BY 
          m.month_start
        ORDER BY 
          m.month_start;
      `
      );
      res.status(200).json({
        stats: result.rows
      });
    }else{
      const result = await pool.query(`
        WITH months AS (
          SELECT generate_series(
            DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '${period} months',
            DATE_TRUNC('month', CURRENT_DATE),
            INTERVAL '1 month'
          )::date AS month_start
        )
        SELECT 
          EXTRACT(MONTH FROM m.month_start)::int AS month_number,
          TO_CHAR(m.month_start, 'Mon') AS month_name,
          COALESCE(SUM(r.total_price + r.insurance + r.fees), 0) AS income,
          COUNT(r.id) AS rentals
        FROM 
          months m
        LEFT JOIN (
          SELECT r.*
          FROM rentals r
          INNER JOIN vehicle_stock vs ON vs.vehicle_id = r.vehicle_id
          WHERE 
            vs.office_id = $1
            AND r.paid = TRUE 
            AND r.status = 'completed'
        ) r
        ON DATE_TRUNC('month', r.created_at) = m.month_start
        GROUP BY 
          m.month_start
        ORDER BY 
          m.month_start;
      `, [period]);   
      res.status(200).json({
        stats: result.rows
      });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
  
module.exports = {
  getOrders,
  getOrdersbyOffice,
  getStats,
  getCounts,
  getStatsDaily,
  getStatsMonthly,
  changeStat,
  removeOrder
};
  