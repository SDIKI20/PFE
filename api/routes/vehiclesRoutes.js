const express = require("express");
const router = express.Router();
const vehiclesController = require("../controllers/vehiclesController");

router.delete("/delete/:id", vehiclesController.deleteVehicle);
router.get("/all", vehiclesController.getVehicles);
router.get("/brands", vehiclesController.getBrands);
router.get("/brands/all/:brand_id", vehiclesController.getBrandVehicles);
router.get("/av/:office/:id", vehiclesController.checkAvailability);
router.get("/get/:id/:uid", vehiclesController.getVehicle);
module.exports = router;
