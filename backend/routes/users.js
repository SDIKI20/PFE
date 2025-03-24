const express = require("express");
const { 
    getUsers,
    addUser,
    confirmPhone,
    checkPhone,
    loginUser,
    logoutUser, 
    getAuthenticatedUser, 
    authMiddleware
} = require("../controllers/userController");

const router = express.Router();
//get all users
router.get("/getusers", getUsers);


// Public Routes
router.post("/add", addUser);
router.post("/confirmphone", confirmPhone);
router.get("/checkphone", checkPhone);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// 🔒 Protected Route: Check Authenticated User
router.get("/protected", authMiddleware, getAuthenticatedUser);

module.exports = router;
