const express = require("express");
const cors = require("cors");
//app.use(cors({ origin: "siteURL" })); //after Deployment
const helmet = require("helmet");

require("dotenv").config();

const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);

// Load email routes
const emailRoutes = require('./routes/emailRoutes');
app.use('/api/email', emailRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
