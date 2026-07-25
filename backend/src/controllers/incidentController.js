const Incident = require('../models/Incident'); // Import Model Sự cố
const Device = require('../models/Device');     // Import Model Thiết bị

// [PUT] /api/incidents/:id/resolve
// KTV cập nhật tiến độ xử lý sự cố & bảo trì vi mạch
exports.resolveIncident = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { technicianNotes, status, replacedComponents } = req.body;

    // 1. Cập nhật nhật ký sự cố
    const updatedIncident = await Incident.findByIdAndUpdate(
      incidentId,
      {
        status: status || 'RESOLVED', // Trạng thái: Đã xử lý
        technicianNotes,              // Ghi chú của KTV
        replacedComponents,          // Linh kiện/Vi mạch đã thay thế
        resolvedAt: new Date()
      },
      { new: true }
    );

    if (!updatedIncident) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sự cố!' });
    }

    // 2. Tự động chuyển trạng thái Trạm/Thiết bị về "Hoạt động" (ACTIVE)
    await Device.findByIdAndUpdate(updatedIncident.deviceId, {
      status: 'active',
      lastMaintenance: new Date()
    });

    return res.status(200).json({
      success: true,
      message: 'Cập nhật nhật ký bảo trì & xử lý sự cố thành công!',
      data: updatedIncident
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};