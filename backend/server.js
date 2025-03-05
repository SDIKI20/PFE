const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const userRoutes = require("./routes/users");
const uploadRoutes = require("./routes/uploadRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const emailRoutes = require('./routes/emailRoutes');

//app.use(cors({ origin: "siteURL" })); //after Deployment

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use('/api/email', emailRoutes);
app.use("/assets", express.static(path.join(__dirname, "../../assets")));
app.use("/api/upload", uploadRoutes);
app.use("/api/sms", verificationRoutes);



// Start Server
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
