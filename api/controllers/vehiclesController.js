const { pool } = require("../config/dbConfig");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");

// Multer setup to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image to Cloudinary
const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "vehicles",
      use_filename: true,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Image upload failed");
  }
};

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

// Add a new vehicle with image upload
const addVehicle = async (req, res) => {
  try {
    const {
      brand_id, model, name, color, capacity, fuel, transmission, availability, body, price, location,
      units, speed, horsepower, engine_type, rental_type
    } = req.body;

    // Set default values if not provided
    const vehicleUnits = units || 0;
    const vehicleSpeed = speed || 0;
    const vehicleHorsepower = horsepower || 0;
    const vehicleEngineType = engine_type || 'unknown';
    const vehicleRentalType = rental_type || 'h'; // Default 'h' for rental_type
    const vehicleTransmission = transmission || 'Manual'; // Default 'Manual' for transmission

    // Upload images to Cloudinary
    const mainImage = req.files["image"] ? await uploadImage(req.files["image"][0]) : "/assets/cars/default.png";
    const prevImage1 = req.files["prev_image1"] ? await uploadImage(req.files["prev_image1"][0]) : "/assets/cars/default_prev.jpg";
    const prevImage2 = req.files["prev_image2"] ? await uploadImage(req.files["prev_image2"][0]) : "/assets/cars/default_prev.png";
    const prevImage3 = req.files["prev_image3"] ? await uploadImage(req.files["prev_image3"][0]) : "/assets/cars/default_prev.png";

    // SQL query to insert a new vehicle
    const query = `
      INSERT INTO vehicles (brand_id, model, name, color, capacity, fuel, transmission, availability, body, price, location, 
                           image, prev_image1, prev_image2, prev_image3, units, speed, horsepower, engine_type, rental_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *;
    `;

    const values = [
      brand_id, model, name, color, capacity, fuel, vehicleTransmission, availability, body, price, location,
      mainImage, prevImage1, prevImage2, prevImage3, vehicleUnits, vehicleSpeed, vehicleHorsepower, vehicleEngineType, vehicleRentalType
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding vehicle:", error);
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
  addVehicle,
  checkAvailability,
  getFilteredVehicles,
  getBrands,
  getBrandVehicles,
  upload
};
