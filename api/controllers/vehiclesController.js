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
    const result = await pool.query(`
      SELECT vehicles.*, brands.name AS brand_name, brands.logo AS brand_logo
      FROM vehicles
      JOIN brands ON vehicles.brand_id = brands.id
      ORDER BY vehicles.id ASC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get one vehicle by id
const getVehicle = async (req, res) => {
  try {
    const { id, uid } = req.params;
    const carResult = await pool.query(`
      SELECT 
          vehicles.*, 
          brands.name AS brand_name, 
          brands.logo, 
          office.country, 
          office.wilaya,  
          office.address, 
          office.city,
          office.latitude,
          office.longitude,
          ROUND(COALESCE(AVG(reviews.stars), 0), 1) AS stars,
          COUNT(DISTINCT reviews.id) AS reviews,
          COUNT(DISTINCT rentals.id) AS orders
          ${parseInt(uid)>0?", CASE WHEN COUNT(f.vehicle_id) > 0 THEN true ELSE false END AS is_favorite":""}
      FROM 
          vehicles
      JOIN 
          brands ON vehicles.brand_id = brands.id
      JOIN 
          office ON vehicles.location = office.id
      LEFT JOIN 
          reviews ON vehicles.id = reviews.vehicle_id
      LEFT JOIN 
          rentals ON vehicles.id = rentals.vehicle_id
      ${parseInt(uid)>0?"LEFT JOIN favorites f ON f.user_id = $2 AND f.vehicle_id = vehicles.id":""}
      WHERE 
          vehicles.id = $1
      GROUP BY 
          vehicles.id, vehicles.model, vehicles.price, vehicles.rental_type, vehicles.transmission, 
          vehicles.capacity, vehicles.fuel, vehicles.body, vehicles.availability, 
          vehicles.location, vehicles.brand_id, vehicles.image,
          brands.id, office.id
      LIMIT 1;
    `, parseInt(uid)>0?[id, uid]:[id]);

    if (carResult.rows.length === 0) {
      res.status(200).json({ message: "No Vehicle Found!" });
    } else {
      res.status(200).json(carResult.rows[0]);
    }

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

//Check availability of a vehicle by ID
const checkAvailability = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT availability FROM vehicles WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.status(200).json({ available: result.rows[0].availability });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get filtered vehicles with brand_id filter
const getFilteredVehicles = async (req, res) => {
  const { search, brand_id, rentalType, transmission, capacity, body, availability, limit = 12, offset = 0 } = req.query;

  let query = `
    SELECT vehicle.*, brands.name AS brand_name, brands.logo AS brand_logo
    FROM vehicles
    JOIN brands ON vehicle.brand_id = brands.id
    WHERE 1=1
  `;
  const values = [];
  let index = 1;

  if (search) {
    query += ` AND (LOWER(vehicle.name) LIKE $${index} OR LOWER(vehicle.model) LIKE $${index})`;
    values.push(`%${search.toLowerCase()}%`);
    index++;
  }
  if (brand_id) {
    query += ` AND vehicle.brand_id = $${index}`;
    values.push(parseInt(brand_id));
    index++;
  }
  if (rentalType) {
    query += ` AND rental_type = $${index}`;
    values.push(rentalType.toLowerCase());
    index++;
  }
  if (transmission) {
    query += ` AND LOWER(vehicle.transmission::TEXT) = $${index}`;
    values.push(transmission.toLowerCase());
    index++;
  }
  if (capacity) {
    query += ` AND vehicle.capacity = $${index}`;
    values.push(parseInt(capacity));
    index++;
  }
  if (body) {
    query += ` AND LOWER(vehicle.body::TEXT) = $${index}`;
    values.push(body.toLowerCase());
    index++;
  }
  if (availability !== undefined) {
    query += ` AND vehicle.availability = $${index}`;
    values.push(parseInt(availability));
    index++;
  }

  query += ` ORDER BY vehicle.id DESC LIMIT $${index}`;
  values.push(parseInt(limit));
  index++;

  query += ` OFFSET $${index}`;
  values.push(parseInt(offset));

  try {
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching filtered vehicles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getVehicles,
  getVehicle,
  deleteVehicle,
  checkAvailability,
  getFilteredVehicles,
  getBrands,
  getBrandVehicles
};
