const express = require("express");
const router = express.Router();
const MapLocation = require("../models/MapLocation");

// 🟢 KHÁCH VÃNG LAI: Xem bảng xếp hạng môi trường cả nước ngay tại trang chủ
router.get("/provinces", async (req, res, next) => {
  try {
    // Lấy toàn bộ các tỉnh thành từ Database, sắp xếp AQI giảm dần (Ô nhiễm nhất lên đầu)
    const allLocations = await MapLocation.find({}).sort({ aqi: -1 });

    // Tách riêng 3 đô thị lớn trọng điểm lên tháp đầu bảng
    const focusCities = allLocations.filter((loc) =>
      ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"].includes(loc.name)
    );

    // Toàn bộ các tỉnh thành phố xung quanh còn lại trên cả nước
    const nationalRanking = allLocations.filter(
      (loc) => !["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"].includes(loc.name)
    );

    return res.status(200).json({
      success: true,
      data: { focusCities, nationalRanking },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
