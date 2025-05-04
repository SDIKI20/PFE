const express = require("express");
const router = express.Router();
const {
    getOrders,
    getOrdersbyOffice,
    getStats,
    getCounts,
    getStatsDaily,
    getStatsMonthly,
    changeStat,
    removeOrder
} = require("../controllers/orderesController");

router.get("/stats", getStats);
router.get("/counts", getCounts);
router.get("/stats/daily", getStatsDaily);
router.get("/stats/monthly", getStatsMonthly);
router.get("/getOrders", getOrders);
router.get("/getOrders/:office", getOrdersbyOffice);
router.post("/status", changeStat);
router.post("/delete", removeOrder);

module.exports = router;
