const express = require("express");
const router = express.Router();
const {
    getOrders,
    getPendingOrders,
    getActiveOrders,
    getCompletedOrders,
    getCanceledOrders,
    getOrdersbyOffice,
    getStats,
    getStatsDaily,
    getStatsMonthly,
    changeStat,
    removeOrder
} = require("../controllers/orderesController");

router.get("/stats", getStats);
router.get("/stats/daily", getStatsDaily);
router.get("/stats/monthly", getStatsMonthly);
router.get("/getOrders", getOrders);
router.get("/getOrders/:office", getOrdersbyOffice);
router.get("/getOrders/pending", getPendingOrders);
router.get("/getOrders/completed", getCompletedOrders);
router.get("/getOrders/canceled", getCanceledOrders);
router.get("/getOrders/active", getActiveOrders);
router.post("/status", changeStat);
router.post("/delete", removeOrder);

module.exports = router;
