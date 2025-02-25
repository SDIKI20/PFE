const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const userRoutes = require("./routes/users");
const uploadRoutes = require("./routes/uploadRoutes");

//app.use(cors({ origin: "siteURL" })); //after Deployment

require("dotenv").config();

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

// Serve uploaded assets statically
app.use("/assets", express.static(path.join(__dirname, "../../assets")));

// Use upload routes
app.use("/api/upload", uploadRoutes);


// Start Server
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
