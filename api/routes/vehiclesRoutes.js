const express = require("express");
const router = express.Router();
const vehiclesController = require("../controllers/vehiclesController");

const upload = vehiclesController.upload.fields([
  { name: "image", maxCount: 1 },
  { name: "prev_image1", maxCount: 1 },
  { name: "prev_image2", maxCount: 1 },
  { name: "prev_image3", maxCount: 1 },
]);

router.get("/all", vehiclesController.getVehicles);
router.post("/add", upload, vehiclesController.addVehicle);
router.get("/:id/availability", vehiclesController.checkAvailability);
router.get("/filter", vehiclesController.getFilteredVehicles);

module.exports = router;
