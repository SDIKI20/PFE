const express = require("express");
const router = express.Router();
const vehiclesController = require("../controllers/vehiclesController");

router.delete("/delete/:id", vehiclesController.deleteVehicle);
router.get("/all", vehiclesController.getVehicles);
router.get("/brands", vehiclesController.getBrands);
router.get("/brands/all/:brand_id", vehiclesController.getBrandVehicles);
router.get("/:id/availability", vehiclesController.checkAvailability);
router.get("/filter", vehiclesController.getFilteredVehicles);
router.get("/get/:id/:uid", vehiclesController.getVehicle);
module.exports = router;
