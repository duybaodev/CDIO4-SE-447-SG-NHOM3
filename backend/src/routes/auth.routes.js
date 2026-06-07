const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  googleLogin, // 🎯 1. Import thêm hàm xử lý Google vừa được bổ sung bên Controller
} = require("../controllers/authController");
const router = express.Router();

// 🚀 Thông tuyến dữ liệu: Đẩy thẳng lệnh đăng ký vào Controller để xử lý DB và bắn Mail
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// 🎯 2. Định nghĩa tuyến đường xử lý đăng nhập Google mà Frontend đang gọi bị 404
router.post("/google-login", googleLogin);

module.exports = router;
