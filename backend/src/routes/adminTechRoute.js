const express = require("express");
const router = express.Router();

// Gọi các model từ database thật của Bảo
const User = require("../models/User");
const MapLocation = require("../models/MapLocation");
const Incident = require("../models/Incident");

// Biến lưu trữ trạng thái Cảnh báo khẩn cấp hệ thống (Mặc định ban đầu)
let globalEmergencyAlert = {
  active: true,
  message:
    "🚨 CẢNH BÁO KHẨN CẤP: Chỉ số ô nhiễm khí tượng tại khu vực Quận Liên Chiểu đang vượt ngưỡng nguy hại (Vùng Đỏ). Khuyến cáo người dân nên đeo khẩu trang khi ra đường!",
  updatedAt: new Date(),
};

/* =========================================================================
   📢 1. PHÂN HỆ CẢNH BÁO TOÀN QUỐC (SYSTEM EMERGENCY ALERT)
   ========================================================================= */

// API: Cả User và Admin gọi để lấy trạng thái chữ chạy banner thông báo khẩn cấp
router.get("/system/emergency-alert", (req, res) => {
  return res.status(200).json({ success: true, alert: globalEmergencyAlert });
});

// API: Admin bấm nút phát sóng từ Dashboard để cập nhật dòng thông báo khẩn
router.put("/admin/emergency-alert", (req, res) => {
  const { active, message } = req.body;
  globalEmergencyAlert.active =
    active !== undefined ? active : globalEmergencyAlert.active;
  globalEmergencyAlert.message = message || globalEmergencyAlert.message;
  globalEmergencyAlert.updatedAt = new Date();

  return res.status(200).json({
    success: true,
    message: "Hệ thống REMN đã phát sóng thông điệp khẩn cấp thành công!",
    alert: globalEmergencyAlert,
  });
});

/* =========================================================================
   🏢 2. PHÂN HỆ CRUD TRẠM ĐO (Đã đồng bộ URL, đổ sẵn dữ liệu)
   ========================================================================= */

// Thêm trạm mới
router.post("/admin/stations", async (req, res, next) => {
  try {
    const { name, region, temp, humidity, status } = req.body;
    const newStation = new MapLocation({
      name,
      region,
      status: status || "Active",
      aqi: Math.floor(Math.random() * 45) + 15,
      weather: {
        temp: Number(temp) || 27,
        humidity: Number(humidity) || 65,
        windSpeed: 8,
        status: "Trời quang",
      },
    });
    await newStation.save();
    return res
      .status(201)
      .json({ success: true, message: "Đã cắm trạm đo mới vào MongoDB!" });
  } catch (error) {
    next(error);
  }
});

// Cập nhật thông số trạm vĩ mô (Ghi đè chỉ số / Cập nhật Alert riêng cho từng trạm)
router.put("/admin/stations/:id", async (req, res, next) => {
  try {
    const { name, region, temp, humidity, status, aqi, weatherAlert } =
      req.body;
    const currentStation = await MapLocation.findById(req.params.id);
    if (!currentStation)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy trạm!" });

    await MapLocation.findByIdAndUpdate(req.params.id, {
      name: name || currentStation.name,
      region: region || currentStation.region,
      status: status || currentStation.status,
      aqi: aqi !== undefined ? Number(aqi) : currentStation.aqi,
      "weather.temp":
        temp !== undefined ? Number(temp) : currentStation.weather.temp,
      "weather.humidity":
        humidity !== undefined
          ? Number(humidity)
          : currentStation.weather.humidity,
      "weather.status": weatherAlert || currentStation.weather.status,
    });
    return res
      .status(200)
      .json({
        success: true,
        message: "Đã đồng bộ thông số trạm xuống bản đồ người dân!",
      });
  } catch (error) {
    next(error);
  }
});

// Bật / Tắt nhanh trạng thái trạm đo trên dòng bảng
router.put("/admin/update-station/:id", async (req, res, next) => {
  try {
    const { status } = req.body;
    await MapLocation.findByIdAndUpdate(req.params.id, { status });
    return res
      .status(200)
      .json({
        success: true,
        message: "Đã cập nhật trạng thái hoạt động của trạm!",
      });
  } catch (error) {
    next(error);
  }
});

// Xóa trạm đo
router.delete("/admin/stations/:id", async (req, res, next) => {
  try {
    await MapLocation.findByIdAndDelete(req.params.id);
    await Incident.deleteMany({ locationId: req.params.id });
    return res
      .status(200)
      .json({ success: true, message: "Đã tháo dỡ trạm đo khỏi hệ thống!" });
  } catch (error) {
    next(error);
  }
});

/* =========================================================================
   ⚠️ 3. PHÂN HỆ ĐIỀU PHỐI ĐƠN SỰ CỐ TAM GIÁC (Dân báo lỗi - KTV nhận việc)
   ========================================================================= */

// Người dân gửi đơn báo hỏng từ App
router.post("/user/report-issue", async (req, res, next) => {
  try {
    const { locationId, issueDescription, userId } = req.body;
    const newIncident = new Incident({
      reporterId: userId || "65c333333333333333333333", // Thí điểm ID nếu chưa truyền kịp
      locationId,
      issueDescription,
      status: "Pending",
    });
    await newIncident.save();

    // Đơn vừa gửi ➔ Ép trạm đó sang Disabled ngay để báo động
    await MapLocation.findByIdAndUpdate(locationId, { status: "Disabled" });
    return res
      .status(201)
      .json({
        success: true,
        message: "Hệ thống đã ghi nhận phản ánh lỗi phần cứng!",
      });
  } catch (error) {
    next(error);
  }
});

// Lấy danh sách sự cố cho Admin duyệt gán việc
router.get("/admin/incidents", async (req, res, next) => {
  try {
    const list = await Incident.find()
      .populate("reporterId", "username email")
      .populate("locationId", "name region status")
      .populate("assignedTechId", "username email")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

// Phân công KTV
router.put("/admin/assign-tech/:incidentId", async (req, res, next) => {
  try {
    const { assignedTechId, priority } = req.body;
    await Incident.findByIdAndUpdate(req.params.incidentId, {
      assignedTechId,
      priority: priority || "High",
      status: "In Progress",
    });
    return res
      .status(200)
      .json({
        success: true,
        message: "Đã đẩy lệnh sửa chữa sang thiết bị KTV chỉ định!",
      });
  } catch (error) {
    next(error);
  }
});

// KTV sửa xong hiệu chuẩn lại
router.put("/tech/calibrate/:locationId", async (req, res, next) => {
  try {
    const { cpuUsage, ramUsage, sensorStatus, isFixed } = req.body;
    await MapLocation.findByIdAndUpdate(req.params.locationId, {
      "hardwareSpecs.cpuUsage": Number(cpuUsage) || 15,
      "hardwareSpecs.ramUsage": Number(ramUsage) || 40,
      "hardwareSpecs.sensorStatus": sensorStatus || "Ổn định",
      status: isFixed ? "Active" : "Disabled",
    });

    if (isFixed) {
      await Incident.findOneAndUpdate(
        { locationId: req.params.locationId, status: "In Progress" },
        { status: "Resolved", resolvedAt: new Date() }
      );
    }
    return res
      .status(200)
      .json({ success: true, message: "Hiệu chuẩn thành công!" });
  } catch (error) {
    next(error);
  }
});

/* =========================================================================
   👤 4. PHÂN HỆ QUẢN LÝ TÀI KHOẢN (Đồng bộ danh sách thật & Sửa Profile)
   ========================================================================= */

// Lấy toàn bộ danh sách users thật trong DB
router.get("/admin/users-list", async (req, res, next) => {
  try {
    const list = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

// Thêm user mới
router.post("/admin/create-user", async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const exist = await User.findOne({ $or: [{ username }, { email }] });
    if (exist)
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản đã tồn tại!" });

    const newUser = new User({
      username,
      email,
      password,
      role: role || "User",
    });
    await newUser.save();
    return res
      .status(201)
      .json({
        success: true,
        message: "Khởi tạo tài khoản MongoDB thành công!",
      });
  } catch (error) {
    next(error);
  }
});

// Xóa user
router.delete("/admin/delete-user/:id", async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Đã xóa tài khoản!" });
  } catch (error) {
    next(error);
  }
});

// 🟢 User tự cập nhật tài khoản cá nhân cá biệt của mình
router.put("/user/update-profile/:id", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const current = await User.findById(req.params.id);
    if (!current)
      return res
        .status(404)
        .json({ success: false, message: "Tài khoản không tồn tại!" });

    const updateFields = {
      username: username || current.username,
      email: email || current.email,
    };
    if (password && password.trim() !== "") {
      updateFields.password = password;
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    }).select("-password");
    return res
      .status(200)
      .json({
        success: true,
        message: "Hồ sơ của bạn đã được cập nhật mượt mà!",
        data: updated,
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
