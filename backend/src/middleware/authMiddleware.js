const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  // Lấy token từ Header do Frontend gửi lên
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(403).json({
      success: false,
      isGuest: true, // Báo cho Frontend biết đây là khách vãng lai để hiện Popup bắt Đăng nhập
      message: "🔒 Tính năng này yêu cầu đăng nhập tài khoản để xem tiếp!",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Tài khoản không hợp lệ!" });
    }
    req.user = user; // Lưu thông tin cơ sở dữ liệu tài khoản vào request
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi bảo mật hệ thống!" });
  }
};

// Kiểm tra quyền tối cao của Admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(419)
      .json({
        success: false,
        message: "Từ chối truy cập: Bạn không phải là Admin!",
      });
  }
};

module.exports = { requireAuth, requireAdmin };
