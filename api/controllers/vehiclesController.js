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

// Get all vehicles
const getVehicles = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicle ORDER BY id DESC");
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
      brand,
      model,
      name,
      color,
      capacity,
      fuel,
      transmission,
      availability,
      body,
      price,
      location,
    } = req.body;

    // Upload images to Cloudinary
    const mainImage = req.files["image"] ? await uploadImage(req.files["image"][0]) : "/assets/cars/default.png";
    const prevImage1 = req.files["prev_image1"] ? await uploadImage(req.files["prev_image1"][0]) : "/assets/cars/default_prev.jpg";
    const prevImage2 = req.files["prev_image2"] ? await uploadImage(req.files["prev_image2"][0]) : "/assets/cars/default_prev.png";
    const prevImage3 = req.files["prev_image3"] ? await uploadImage(req.files["prev_image3"][0]) : "/assets/cars/default_prev.png";

    const query = `
      INSERT INTO vehicle (brand, model, name, color, capacity, fuel, transmission, availability, body, price, location, image, prev_image1, prev_image2, prev_image3)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `;
    const values = [brand, model, name, color, capacity, fuel, transmission, availability, body, price, location, mainImage, prevImage1, prevImage2, prevImage3];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding vehicle:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Check availability of a vehicle by ID
const checkAvailability = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT availability FROM vehicle WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.status(200).json({ available: result.rows[0].availability });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get filtered vehicles with availability filter
const getFilteredVehicles = async (req, res) => {
const { search, brand, rentalType, transmission, capacity, body, availability, limit = 12, offset = 0 } = req.query;

let query = "SELECT * FROM vehicle WHERE 1=1";
const values = [];
let index = 1;

if (search) {
  query += ` AND (LOWER(name) LIKE $${index} OR LOWER(brand) LIKE $${index} OR LOWER(model) LIKE $${index})`;
  values.push(`%${search.toLowerCase()}%`);
  index++;
}
if (brand) {
  query += ` AND LOWER(brand) = $${index}`;
  values.push(brand.toLowerCase());
  index++;
}
if (rentalType) {
  query += ` AND rental_type = $${index}`;
  values.push(rentalType.toLowerCase());
  index++;
}
if (transmission) {
  query += ` AND LOWER(transmission::TEXT) = $${index}`;
  values.push(transmission.toLowerCase());
  index++;
}
if (capacity) {
  query += ` AND capacity = $${index}`;
  values.push(parseInt(capacity));
  index++;
}
if (body) {
  query += ` AND LOWER(body::TEXT) = $${index}`;
  values.push(body.toLowerCase());
  index++;
}
if (availability !== undefined) {
  query += ` AND availability = $${index}`;
  values.push(parseInt(availability));
  index++;
}

query += " ORDER BY id DESC";

// ✅ Correct way to add LIMIT and OFFSET
query += ` LIMIT $${index}`;
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
  upload, // Export multer middleware for handling file uploads
};
