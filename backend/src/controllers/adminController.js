const User = require("../models/User");
const News = require("../models/News");
const DeviceTask = require("../models/DeviceTask");

// 👥 1. Admin quản lý và chỉnh sửa thông tin thành viên (User & Tech)
const updateUserInfo = async (req, res) => {
  try {
    const { userId, username, role, isVerified } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, role, isVerified },
      { new: true }
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Đã cập nhật dữ liệu tài khoản thành công!",
        data: updatedUser,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 📰 2. Admin đăng bài viết mới kèm bộ lọc tìm kiếm
const createOrUpdateNews = async (req, res) => {
  try {
    const { newsId, title, content, category, thumbnail } = req.body;
    let news;
    if (newsId) {
      news = await News.findByIdAndUpdate(
        newsId,
        { title, content, category, thumbnail },
        { new: true }
      );
    } else {
      news = await News.create({
        title,
        content,
        category,
        thumbnail,
        author: req.user._id,
      });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Đã đồng bộ bài viết lên hệ thống!",
        data: news,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminNews = async (req, res) => {
  try {
    const { search } = req.query; // Lọc tìm kiếm bài viết
    let filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };

    const listNews = await News.find(filter).populate("author", "username");
    return res.status(200).json({ success: true, data: listNews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 📊 3. Xem báo cáo tiến độ thiết bị của Kỹ thuật viên gửi lên
const getDeviceStatusReport = async (req, res) => {
  try {
    const tasks = await DeviceTask.find().populate("assignedTo", "username");
    return res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateUserInfo,
  createOrUpdateNews,
  getAdminNews,
  getDeviceStatusReport,
};
