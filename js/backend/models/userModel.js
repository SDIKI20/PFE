const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const createUserTable = async () => {
    await pool.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            fname VARCHAR(20) NOT NULL,
            lname VARCHAR(20) NOT NULL,
            address VARCHAR(255) NOT NULL,
            country VARCHAR(255) NOT NULL,
            wilaya VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            zipcode VARCHAR(10) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'employee', 'client'))
        );
    `);
};

createUserTable();

module.exports = pool;