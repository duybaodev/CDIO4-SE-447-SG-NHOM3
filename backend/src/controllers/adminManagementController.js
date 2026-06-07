const User = require("../models/User");
const DeviceTask = require("../models/DeviceTask");

// 1. Admin lấy danh sách toàn bộ thành viên hệ thống
const getAllUsersAndTechs = async (req, res) => {
  try {
    const members = await User.find({}, "-password"); // Lấy hết trừ mật khẩu để đảm bảo bảo mật
    return res.status(200).json({ success: true, data: members });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi lấy danh sách thành viên!" });
  }
};

// 2. Admin chỉnh sửa thông tin thành viên (Đổi tên, nâng/hạ quyền hạn Role, Khóa tài khoản)
const updateMemberByAdmin = async (req, res) => {
  try {
    const { userId, username, role, isVerified } = req.body;

    const updatedMember = await User.findByIdAndUpdate(
      userId,
      { username, role, isVerified },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Đã thay đổi dữ liệu của tài khoản ${updatedMember.username} thành công!`,
      data: updatedMember,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi chỉnh sửa tài khoản!" });
  }
};

// 3. Admin theo dõi báo cáo tiến độ sửa thiết bị từ màn hình tổng quan của mình
const getAdminDeviceReport = async (req, res) => {
  try {
    const reports = await DeviceTask.find().populate("assignedTo", "username");
    return res.status(200).json({ success: true, data: reports });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi lấy báo cáo thiết bị!" });
  }
};

module.exports = {
  getAllUsersAndTechs,
  updateMemberByAdmin,
  getAdminDeviceReport,
};
