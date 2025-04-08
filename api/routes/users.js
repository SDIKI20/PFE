const express = require("express");
const { 
    getUsers,
    confirmPhone,
    checkPhone,
    checkAccountStat,
    confirmAccount,
    addFav
} = require("../controllers/userController");

const router = express.Router();

//get all users
router.get("/getusers", getUsers);

// Public Routes
router.post("/confirmphone", confirmPhone);
router.post("/confirmaccount", confirmAccount);
router.get("/checkphone", checkPhone);
router.get("/checkaccountstat", checkAccountStat);
router.post("/add/favorite", addFav);

module.exports = router;
