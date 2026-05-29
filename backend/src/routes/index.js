const express = require("express");
const authRoutes = require("./auth.routes");
const airQualityRoutes = require("./airQuality.routes");

const router = express.Router();

// Gộp các tuyến đường API
router.use("/auth", authRoutes);
router.use("/air-quality", airQualityRoutes);

module.exports = router;
