const DeviceTask = require("../models/DeviceTask");

// Kỹ thuật viên báo cáo cập nhật trạng thái đã hoàn thành sửa chữa thiết bị lên hệ thống
const completeDeviceFix = async (req, res) => {
  try {
    const { taskId, techNote } = req.body;

    const updatedTask = await DeviceTask.findByIdAndUpdate(
      taskId,
      {
        status: "Completed",
        techNote: techNote,
        completedAt: new Date(),
      },
      { new: true }
    );

    console.log(
      `🛠️ Kỹ thuật viên đã sửa xong thiết bị: ${updatedTask.deviceName}. Đã đồng bộ lên Admin!`
    );

    return res.status(200).json({
      success: true,
      message:
        "🎉 Báo cáo sửa chữa thiết bị đã được gửi thành công lên màn hình Admin!",
      data: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { completeDeviceFix };
