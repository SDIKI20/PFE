const express = require("express");
const { 
    getUsers,
    confirmPhone,
    checkPhone,
} = require("../controllers/userController");

const router = express.Router();

//get all users
router.get("/getusers", getUsers);

// Public Routes
router.post("/confirmphone", confirmPhone);
router.get("/checkphone", checkPhone);

module.exports = router;
