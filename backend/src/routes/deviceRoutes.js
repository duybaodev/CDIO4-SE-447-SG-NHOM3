const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Device = require("../models/Device");
const DeviceTask = require("../models/DeviceTask");
const User = require("../models/User");

// Middleware xác thực bảo vệ luồng thiết bị
const requireAuthInternal = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res
      .status(403)
      .json({
        success: false,
        isGuest: true,
        message: "🔒 Vui lòng đăng nhập tài khoản!",
      });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "REMN_SECRET");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Token không hợp lệ!" });
  }
};

// 🟢 Lấy danh sách toàn bộ trạm cảm biến hiển thị trên hệ thống Windy/Bản đồ
router.get("/list", async (req, res, next) => {
  try {
    const devices = await Device.find({});
    return res.status(200).json({ success: true, data: devices });
  } catch (error) {
    next(error);
  }
});

// 🛠️ KỸ THUẬT VIÊN: Báo cáo hoàn thành sửa trạm hỏng → Tự động nhảy trạng thái ở màn hình Admin
router.post(
  "/tech/complete-task",
  requireAuthInternal,
  async (req, res, next) => {
    try {
      const { taskId, techNote } = req.body;

      const updatedTask = await DeviceTask.findByIdAndUpdate(
        taskId,
        { status: "Completed", techNote: techNote, completedAt: new Date() },
        { new: true }
      );

      if (!updatedTask)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy phiếu sửa chữa!" });

      return res.status(200).json({
        success: true,
        message:
          "🎉 Sửa chữa hoàn tất! Tiến độ đã được cập nhật đồng bộ lên giao diện điều phối của Admin.",
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 👑 ADMIN: Quản lý toàn bộ danh sách tài khoản User và Kỹ thuật viên hệ thống
router.get("/admin/members", requireAuthInternal, async (req, res, next) => {
  try {
    const members = await User.find({}, "-password");
    return res.status(200).json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
});

// 👑 ADMIN: Thay đổi thông tin hiển thị của User/Tech → Bên giao diện người dùng lập tức đổi theo
router.put(
  "/admin/update-member",
  requireAuthInternal,
  async (req, res, next) => {
    try {
      const { userId, username, role } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, role },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message:
          "⚙️ Đã chỉnh sửa thông tin thành viên. Nội dung hiển thị của tài khoản đã được đồng bộ!",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
);

// 👑 ADMIN: Theo dõi tiến độ sửa chữa thiết bị của các kỹ thuật viên gửi về liên tục
router.get(
  "/admin/device-report",
  requireAuthInternal,
  async (req, res, next) => {
    try {
      const reports = await DeviceTask.find().sort({ updatedAt: -1 });
      return res.status(200).json({ success: true, data: reports });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
