const express = require("express");
const router = express.Router();
const {
    getOrders,
    getPendingOrders,
    getActiveOrders,
    getCompletedOrders,
    getCanceledOrders,
    changeStat,
    removeOrder
} = require("../controllers/orderesController");

router.get("/getOrders", getOrders);
router.get("/getOrders/pending", getPendingOrders);
router.get("/getOrders/completed", getCompletedOrders);
router.get("/getOrders/canceled", getCanceledOrders);
router.get("/getOrders/active", getActiveOrders);
router.post("/status", changeStat);
router.post("/delete", removeOrder);

module.exports = router;
