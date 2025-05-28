const express = require("express");
const multer = require('multer');
const upload = multer()
const router = express.Router();
const {
    getOrders,
    getOrdersbyOffice,
    getStats,
    getCounts,
    getStatsDaily,
    getStatsMonthly,
    getOrder,
    getProfit,
    changeStat,
    rent,
    removeOrder
} = require("../controllers/orderesController");

router.get("/stats", getStats);
router.get("/counts", getCounts);
router.get("/stats/daily", getStatsDaily);
router.get("/stats/monthly", getStatsMonthly);
router.get("/getOrders", getOrders);
router.get("/getOrder", getOrder);
router.get("/getProfit", getProfit);
router.get("/getOrders/:office", getOrdersbyOffice);
router.post("/status", changeStat);
router.post("/delete", removeOrder);
router.post("/add", upload.none(), rent);

module.exports = router;
