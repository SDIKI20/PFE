const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const createOrderTable = async () => {
  await pool.query(`
       CREATE TABLE reservations (
                id SERIAL PRIMARY KEY,
                client_id INT REFERENCES clients(id) ON DELETE CASCADE,
                vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                status VARCHAR(10) CHECK (status IN ('pending', 'confirmed', 'canceled', 'completed')) DEFAULT 'pending',
                reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `);
};
//createOrderTable();
module.exports = pool;
