-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'employee', 'client')) NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    fuel_type VARCHAR(10) CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid')) NOT NULL,
    mileage INT NOT NULL,
    condition VARCHAR(100) NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    availability BOOLEAN DEFAULT TRUE,
    images TEXT
);

-- Clients Table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    driver_license VARCHAR(100) NOT NULL,
    identity_card VARCHAR(100) NOT NULL
);

-- Employees Table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

-- Reservations Table
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('pending', 'confirmed', 'canceled', 'completed')) DEFAULT 'pending',
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    reservation_id INT UNIQUE REFERENCES reservations(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(15) CHECK (method IN ('credit card', 'paypal', 'stripe', 'cash')) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deposits Table
CREATE TABLE deposits (
    id SERIAL PRIMARY KEY,
    reservation_id INT UNIQUE REFERENCES reservations(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(15) CHECK (status IN ('held', 'refunded', 'pending')) DEFAULT 'pending',
    operation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices Table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    reservation_id INT UNIQUE REFERENCES reservations(id) ON DELETE CASCADE,
    invoice_file VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Returns Table
CREATE TABLE returns (
    id SERIAL PRIMARY KEY,
    reservation_id INT UNIQUE REFERENCES reservations(id) ON DELETE CASCADE,
    return_condition VARCHAR(100) NOT NULL,
    additional_fees DECIMAL(10,2) DEFAULT 0.00,
    return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee Actions Table
CREATE TABLE employee_actions (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);