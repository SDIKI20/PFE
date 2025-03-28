const express = require("express");
const { 
    getUsers,
    confirmPhone,
    checkPhone,
    checkAccountStat,
    confirmAccount,
} = require("../controllers/userController");

const router = express.Router();

//get all users
router.get("/getusers", getUsers);

// Public Routes
router.post("/confirmphone", confirmPhone);
router.post("/confirmaccount", confirmAccount);
router.get("/checkphone", checkPhone);
router.get("/checkaccountstat", checkAccountStat);

module.exports = router;
