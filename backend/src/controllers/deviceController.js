const Device = require("../models/Device");
// 🎯 ĐÃ ĐỒNG BỘ: Gọi chính xác Model DeviceTask của Bảo để không bị lỗi "not defined" hay crash server nữa
const DeviceTask = require("../models/DeviceTask");

// 1. Lấy toàn bộ danh sách trạm cảm biến
const getDevices = async (req, res, next) => {
  try {
    const devices = await Device.find({});
    res.status(200).json({ success: true, data: devices });
  } catch (error) {
    next(error);
  }
};

// 2. Admin thay đổi trạng thái trạm (Duyệt / Dừng / Kích hoạt lại)
const updateDeviceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const device = await Device.findOneAndUpdate(
      { deviceId: id },
      { status, lastUpdate: Date.now() },
      { new: true }
    );
    if (!device)
      return res.status(404).json({ message: "Không tìm thấy trạm!" });

    res.status(200).json({ success: true, data: device });
  } catch (error) {
    next(error);
  }
};

// 3. 🚀 Kỹ thuật viên báo cáo cập nhật trạng thái đã sửa chữa xong thiết bị
const completeDeviceFix = async (req, res, next) => {
  try {
    const { taskId, techNote } = req.body;

    // 🎯 ĐÃ ĐỒNG BỘ: Sử dụng chuẩn xác biến DeviceTask khớp với file Schema của bạn
    const updatedTask = await DeviceTask.findByIdAndUpdate(
      taskId,
      {
        status: "Completed",
        techNote: techNote, // Ghi chú kỹ thuật khi sửa xong
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Không tìm thấy phiếu yêu cầu sửa chữa này!",
        });
    }

    return res.status(200).json({
      success: true,
      message:
        "🎉 Đã hoàn thành sửa chữa! Hệ thống đã tự động đẩy báo cáo trạng thái về giao diện Admin.",
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDevices, updateDeviceStatus, completeDeviceFix };
