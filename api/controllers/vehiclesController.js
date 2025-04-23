const { Query } = require("pg");
const { pool } = require("../config/dbConfig");

// Get all brands
const getBrands = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM brands ORDER BY name ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all cars of a specific brand
const getBrandVehicles = async (req, res) => {
  const { brand_id } = req.params;

  if (!brand_id) {
    return res.status(400).json({ error: "Brand ID is required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM vehicles WHERE brand_id = $1 ORDER BY id DESC",
      [parseInt(brand_id)]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching brand's cars:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all vehicles
const getVehicles = async (req, res) => {
  try {
    const { limit = 5, offset = 0, order = "id", dire = "DESC" } = req.query;

    const allowedOrders = ['id', 'created_at']; 
    const allowedDirections = ['ASC', 'DESC'];

    const safeOrder = allowedOrders.includes(order) ? order : 'id';
    const safeDire = allowedDirections.includes(dire.toUpperCase()) ? dire.toUpperCase() : 'DESC';

    // Get the total count (without limit/offset)
    const countResult = await pool.query(`
      SELECT COUNT(*) FROM vehicle_stock vs
      JOIN vehicles v ON v.id = vs.vehicle_id
    `);

    const total = parseInt(countResult.rows[0].count, 10);

    // Get paginated data
    const result = await pool.query(
      `
      SELECT  vs.units,
              v.*,
              b.name AS brand_name, b.logo AS brand_logo,
              o.country, o.wilaya, o.city, o.address
      FROM
          vehicle_stock vs
          JOIN vehicles v ON v.id = vs.vehicle_id
          JOIN brands b ON b.id = v.brand_id
          JOIN office o ON o.id = vs.office_id
      ORDER BY v.${safeOrder} ${safeDire}
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    res.status(200).json({
      total,
      vehicles: result.rows
    });

  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get one vehicle by id
const getVehicle = async (req, res) => {
  try {
    const { id, uid } = req.params;
    const hasUser = parseInt(uid) > 0;

    const query = `
      SELECT 
        v.id,
        v.model,
        v.price,
        v.rental_type,
        v.transmission,
        v.capacity,
        v.fuel,
        v.body,
        v.availability,
        v.image,
        v.prevImage1,
        v.prevImage2,
        v.prevImage3,
        v.description,
        v.color,
        v.fab_year,
        v.doors,
        v.speed,
        v.horsepower,
        v.engine_type,
        v.created_at,

        b.name AS brand_name,
        b.logo,

        o.id AS office_id,
        o.country,
        o.wilaya,
        o.city,
        o.address,
        o.latitude,
        o.longitude,

        ROUND(COALESCE(AVG(r.stars), 0), 1) AS stars,
        COUNT(DISTINCT r.id) AS reviews,
        COUNT(DISTINCT rent.id) AS orders
        ${hasUser ? ", CASE WHEN COUNT(f.vehicle_id) > 0 THEN true ELSE false END AS is_favorite" : ""}
      FROM vehicles v
      JOIN brands b ON v.brand_id = b.id
      JOIN vehicle_stock vs ON vs.vehicle_id = v.id
      JOIN office o ON vs.office_id = o.id
      LEFT JOIN reviews r ON v.id = r.vehicle_id
      LEFT JOIN rentals rent ON v.id = rent.vehicle_id
      ${hasUser ? "LEFT JOIN favorites f ON f.user_id = $2 AND f.vehicle_id = v.id" : ""}
      WHERE v.id = $1
      GROUP BY 
        v.id, v.model, v.price, v.rental_type, v.transmission, 
        v.capacity, v.fuel, v.body, v.availability, 
        v.image, v.prevImage1, v.prevImage2, v.prevImage3, 
        v.description, v.color, v.fab_year, v.doors, v.speed, 
        v.horsepower, v.engine_type, v.created_at,
        b.id,
        o.id
      LIMIT 1;
    `;

    const values = hasUser ? [id, uid] : [id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No Vehicle Found!" });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteVehicle = async (req, res) => {
  const vehicleId = req.params.id;

  try {
    const result = await pool.query("DELETE FROM vehicles WHERE id = $1", [vehicleId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkAvailability = async (req, res) => {
  const { id, office } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        CASE 
          WHEN vs.units > 0 AND (
            SELECT COUNT(*) 
            FROM rentals r 
            WHERE r.vehicle_id = v.id AND r.status IN ('active', 'pending')
          ) < vs.units 
          THEN TRUE 
          ELSE FALSE 
        END AS is_available
      FROM 
        vehicles v
      JOIN 
        vehicle_stock vs ON vs.vehicle_id = v.id
      WHERE 
        v.id = $1 AND vs.office_id = $2
      LIMIT 1;
    `, [id, office]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    res.status(200).json({ availability: result.rows[0].is_available });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getVehicles,
  getVehicle,
  deleteVehicle,
  checkAvailability,
  getBrands,
  getBrandVehicles
};
