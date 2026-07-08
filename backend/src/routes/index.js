const express = require("express");
const router = express.Router();

// 🎯 1. KẾT NỐI CHÍNH XÁC ĐẾN CÁC FILE CON CÓ SẴN TRONG THƯ MỤC CỦA BẢO
const authRoutes = require("./auth.routes.js");
const newsRoutes = require("./newsRoutes.js");
const rankingRoutes = require("./rankingRoutes.js");
const airQualityRoutes = require("./airQuality.routes.js");
const deviceRoutes = require("./deviceRoutes.js");
const logRoutes = require("./logRoutes.js"); // Nạp luôn cả file logRoutes.js có sẵn của bạn

/* =========================================================================
   🔀 PHÂN LUỒNG CỔNG API ĐỂ ĐÓN TIẾN TRÌNH DỮ LIỆU TỪ FRONTEND REACT
   ========================================================================= */

// 🔐 Luồng 1: Xác thực tài khoản, Đăng ký, OTP, Google Login
router.use("/auth", authRoutes);

// 📰 Luồng 2: Phân hệ tin tức môi trường (Admin đăng bài, sửa bài, bộ lọc)
router.use("/news", newsRoutes);

// 📊 Luồng 3: Bảng xếp hạng AQI tập trung 3 thành phố lớn (Đà Nẵng, Hà Nội, HCM)
router.use("/ranking", rankingRoutes);

// 🌍 Luồng 4: Bản đồ vùng ô nhiễm (Trường Sa - Hoàng Sa), Thời tiết theo giờ, AI nhận xét
router.use("/air-quality", airQualityRoutes);

// 🛠️ Luồng 5: Kỹ thuật viên xử lý, điều chỉnh, báo cáo sửa thiết bị về Admin
router.use("/devices", deviceRoutes);

// 📋 Luồng 6: Quản lý lịch sử hệ thống
router.use("/logs", logRoutes);

module.exports = router;
