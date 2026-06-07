const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const News = require("../models/News"); // Gọi Model tin tức thật

// Middleware bảo vệ nghiêm ngặt quyền Admin đăng bài
const requireAdminInternal = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res
      .status(403)
      .json({
        success: false,
        isGuest: true,
        message: "🔒 Vui lòng đăng nhập quyền quản trị!",
      });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "REMN_SECRET");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Phiên làm việc hết hạn!" });
  }
};

// 🟢 NGƯỜI DÙNG/KHÁCH VÃNG LAI: Đọc danh sách bài viết + Thanh công cụ bộ lọc tìm kiếm bài viết
router.get("/admin/news/list", async (req, res, next) => {
  try {
    const { search } = req.query; // ?search=o nhiem
    let query = {};
    if (search) {
      query.title = { $regex: search, $options: "i" }; // Tìm kiếm gần đúng không phân biệt hoa thường
    }

    const listNews = await News.find(query).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: listNews });
  } catch (error) {
    next(error);
  }
});

// 👑 ADMIN TỐI CAO: Đăng bài viết môi trường mới hoặc Chỉnh sửa bài viết cũ
router.post(
  "/admin/news/save",
  requireAdminInternal,
  async (req, res, next) => {
    try {
      const { newsId, title, summary, content, imageUrl, category } = req.body;

      let news;
      if (newsId) {
        // 🔄 Nếu có newsId gửi lên → Thực hiện chỉnh sửa cập nhật bài viết cũ
        news = await News.findByIdAndUpdate(
          newsId,
          { title, summary, content, imageUrl, category },
          { new: true }
        );
      } else {
        // ➕ Nếu không có newsId → Tiến hành tạo và lưu bài viết mới tinh
        news = new News({
          title,
          summary,
          content,
          imageUrl,
          category,
          author: req.userId,
        });
        await news.save();
      }

      return res
        .status(200)
        .json({
          success: true,
          message: "Đã đồng bộ bài viết lên hệ thống thành công!",
          data: news,
        });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
