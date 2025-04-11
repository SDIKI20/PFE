const { pool } = require("../config/dbConfig");

// Update phone status
const confirmPhone = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ error: "User ID is required" });

        await pool.query(`UPDATE users SET phone_status = TRUE WHERE id = $1;`, [id]);

        res.redirect(`/home`);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Update account status
const confirmAccount = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ error: "User ID is required" });

        await pool.query(`UPDATE users SET account_status = TRUE WHERE id = $1;`, [id]);

        res.json({ message: "Account Verified" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Check phone
const checkPhone = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) return res.status(400).json({ error: "User ID is required" });

        const users = await pool.query("SELECT phone_status FROM users WHERE id = $1", [id]);

        if (users.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ phone_status: users.rows[0].phone_status });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Check AccountStat
const checkAccountStat = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) return res.status(400).json({ error: "User ID is required" });

        const users = await pool.query("SELECT account_status FROM users WHERE id = $1", [id]);

        if (users.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ account_status: users.rows[0].account_status });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Get All Users
const getUsers = async (req, res) => {
    try {
        const users = await pool.query("SELECT * FROM users");
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Add a vehicle to user favorite
const addFav = async (req, res) => {
    try {
        const { u, v } = req.body;

        if (!u || !v) {
            return res.status(400).json({ error: "Missing user id or vehicle id" });
        }

        // Check if the favorite already exists
        const result = await pool.query(
            "SELECT * FROM favorites WHERE user_id = $1 AND vehicle_id = $2", 
            [parseInt(u), parseInt(v)]
        );

        if (result.rows.length > 0) {
            // If a favorite already exists, return a duplicate message
            return res.status(409).json({ message: "This vehicle is already in the favorites" });
        }

        // Insert the new favorite
        await pool.query(
            "INSERT INTO favorites (user_id, vehicle_id) VALUES ($1, $2)", 
            [parseInt(u), parseInt(v)]
        );
        res.json({ message: "Vehicle added to favorite" });

    } catch (error) {
        console.error("Error adding vehicle:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getRentals = async (req, res) => {
    try {
        const {
            id,
            search,
            start_date,
            end_date,
            status,
            ody,
            limit = 10, // default limit is 10
            offset = 0  // default offset is 0
        } = req.query;

        if (id) {
            const values = [id];
            const conditions = ["user_id = $1"];
            let index = values.length + 1;

            if (search) {
                conditions.push(`(
                    brands.name ILIKE $${index} OR
                    vehicles.model ILIKE $${index} OR
                    CAST(vehicles.fab_year AS TEXT) ILIKE $${index}
                )`);
                values.push(`%${search}%`);
                index++;
            }

            if (start_date) {
                conditions.push(`rentals.start_date >= $${index++}`);
                values.push(start_date);
            }

            if (end_date) {
                conditions.push(`rentals.end_date <= $${index++}`);
                values.push(end_date);
            }

            if (status) {
                conditions.push(`rentals.status = $${index++}`);
                values.push(status);
            }

            const whereClause = `WHERE ${conditions.join(" AND ")}`;

            let orderByClause = `ORDER BY rentals.created_at DESC`; // default order
            if (ody === "price") {
                orderByClause = `ORDER BY rentals.total_price DESC`;
            } else if (ody === "date") {
                orderByClause = `ORDER BY rentals.created_at DESC`;
            }

            // Query to get the total count of rentals matching the filters
            const countResult = await pool.query(`
                SELECT COUNT(*) AS total_count
                FROM rentals 
                JOIN vehicles ON vehicles.id = rentals.vehicle_id
                JOIN brands ON vehicles.brand_id = brands.id
                ${whereClause}
            `, values);

            const total = countResult.rows[0].total_count; // Total number of rentals

            // Query to get the paginated results
            const rentalsResult = await pool.query(`
                SELECT rentals.*,
                    vehicles.model, vehicles.fab_year, vehicles.rental_type,
                    brands.name AS brand_name
                FROM rentals 
                JOIN vehicles ON vehicles.id = rentals.vehicle_id
                JOIN brands ON vehicles.brand_id = brands.id
                ${whereClause}
                ${orderByClause}
                LIMIT $${index++} OFFSET $${index++}  -- Adding limit and offset
            `, [...values, limit, offset]);

            res.json({
                total,
                rentals: rentalsResult.rows
            });
        } else {
            return res.status(404).json({ error: "Something went wrong!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};
const deleteuser = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const resultuser = await pool.query("DELETE FROM users WHERE id = $1", [userId]);
  
      if (resultuser.rowCount === 0) {
        return res.status(404).json({ message: "user not found" });
      }
  
      res.status(200).json({ message: "user deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const getClients = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE role = 'Client'");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching clients:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAdmins = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE role = 'Admin'");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getEmployees = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE role = 'Employe'");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { 
    getUsers,
    confirmPhone, 
    checkPhone,
    checkAccountStat,
    confirmAccount,
    getRentals,
    addFav,
    deleteuser,
    getClients,
    getAdmins,
    getEmployees
};