const express = require("express");
const { getOrders, newOrder } = require("../controllers/orderescontroller");

const router = express.Router();

router.get("/getOrders", getOrders);
router.post("/newOrder", newOrder);

module.exports = router;