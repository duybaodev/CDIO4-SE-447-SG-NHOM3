const MapLocation = require("../models/MapLocation");

// 🎯 HỢP NHẤT: Lấy bảng xếp hạng ô nhiễm tập trung 3 thành phố lớn và phạm vi cả nước
exports.getAirRanking = async (req, res, next) => {
  try {
    // 1. Sắp xếp tất cả các tỉnh thành từ MongoDB theo chỉ số ô nhiễm AQI giảm dần (Tệ nhất lên đầu)
    // Nếu Bảo muốn đảo lại từ sạch nhất đến ô nhiễm nhất như cũ thì đổi -1 thành 1 nhé
    const allLocations = await MapLocation.find({}).sort({ aqi: -1 });

    // 2. Tách ưu tiên cụm 3 đầu cầu trọng điểm theo yêu cầu của Bảo để Frontend đập vào mắt người xem
    const focusCities = allLocations.filter((loc) =>
      ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"].includes(loc.name)
    );

    // 3. Gom lọc các tỉnh thành phố vệ tinh và toàn bộ khu vực còn lại trên cả nước
    const nationalRanking = allLocations.filter(
      (loc) => !["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"].includes(loc.name)
    );

    // 4. Trả về cấu trúc dữ liệu phân luồng mượt mà cho Frontend React xử lý render giao diện
    return res.status(200).json({
      success: true,
      data: {
        focusCities, // Mảng chứa dữ liệu Hà Nội, HCM, Đà Nẵng
        nationalRanking, // Mảng chứa toàn bộ các tỉnh thành còn lại
      },
    });
  } catch (error) {
    // Giữ nguyên cơ chế bắt lỗi tập trung (Centralized Error Handling) qua hàm next của file cũ Bảo đang dùng
    next(error);
  }
};
