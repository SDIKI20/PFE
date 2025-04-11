const express = require("express");
const { 
    getUsers,
    confirmPhone,
    checkPhone,
    checkAccountStat,
    confirmAccount,
    getRentals,
    addFav,
    deleteuser
} = require("../controllers/userController");

const router = express.Router();

//get all users
router.get("/getusers", getUsers);

// Public Routes
router.post("/confirmphone", confirmPhone);
router.post("/confirmaccount", confirmAccount);
router.post("/add/favorite", addFav);
router.get("/checkphone", checkPhone);
router.get("/rentals", getRentals);
router.get("/checkaccountstat", checkAccountStat);
router.delete("/deleteuser/:id", deleteuser);

module.exports = router;
