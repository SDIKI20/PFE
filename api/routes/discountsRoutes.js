const express = require("express");
const router = express.Router();
const discountsController = require("../controllers/discountsController");

router.get("/coupon/use", discountsController.useCoupon);
router.get("/coupon/:id", discountsController.getCoupon);
router.get("/discount/:id", discountsController.getDiscount);
router.get("/coupons/all", discountsController.getCoupons);
router.get("/discounts/all", discountsController.getDiscounts);
router.get("/all", discountsController.getAll);
router.post("/add/discount", discountsController.addDiscount);
router.post("/add/coupon", discountsController.addCoupon);
router.get("/delete/coupon/:id", discountsController.removeCoupon);
router.get("/delete/discount/:id", discountsController.removeDiscount);
module.exports = router;
