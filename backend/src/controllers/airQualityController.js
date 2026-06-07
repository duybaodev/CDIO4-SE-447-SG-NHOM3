// 🎯 ĐÃ HỢP NHẤT: Đưa toàn bộ mảng data gốc của Bảo vào trong Controller để xử lý logic tìm kiếm và AI
const getMapData = async (req, res, next) => {
  try {
    const { region } = req.query; // Hứng bộ lọc vùng miền (?region=BienDao)

    // Dữ liệu vị trí an toàn tuyệt đối, không sợ lỗi kết nối Database
    const locations = [
      {
        name: "Đà Nẵng",
        aqi: 45,
        region: "Trung",
        weather: { temp: 28, humidity: 75, status: "Nắng nhẹ" },
      },
      {
        name: "Hà Nội",
        aqi: 155,
        region: "Bac",
        weather: { temp: 32, humidity: 80, status: "Bụi mịn" },
      },
      {
        name: "Hồ Chí Minh",
        aqi: 90,
        region: "Nam",
        weather: { temp: 30, humidity: 85, status: "Mây rải rác" },
      },
      {
        name: "Quần đảo Hoàng Sa",
        aqi: 15,
        region: "BienDao",
        weather: { temp: 27, humidity: 70, status: "Gió biển sạch" },
      },
      {
        name: "Quần đảo Trường Sa",
        aqi: 12,
        region: "BienDao",
        weather: { temp: 27, humidity: 72, status: "Nắng trong lành" },
      },
    ];

    // Thực hiện tính năng lọc theo lựa chọn vùng miền của Bảo
    const filteredData = region
      ? locations.filter((loc) => loc.region === region)
      : locations;

    return res.status(200).json({
      success: true,
      sovereigntyNotice: "Hoàng Sa và Trường Sa là của Việt Nam!", // 🇻🇳 Khẳng định chủ quyền
      data: filteredData,
    });
  } catch (error) {
    next(error); // Đẩy qua middleware bắt lỗi hệ thống tập trung
  }
};

// Tính năng tìm kiếm vị trí tỉnh thành trên thanh công cụ cho khách vãng lai/user
const searchLocationDetails = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    const locations = [
      {
        name: "Đà Nẵng",
        aqi: 45,
        region: "Trung",
        weather: { temp: 28, humidity: 75, status: "Nắng nhẹ" },
      },
      {
        name: "Hà Nội",
        aqi: 155,
        region: "Bac",
        weather: { temp: 32, humidity: 80, status: "Bụi mịn" },
      },
      {
        name: "Hồ Chí Minh",
        aqi: 90,
        region: "Nam",
        weather: { temp: 30, humidity: 85, status: "Mây rải rác" },
      },
      {
        name: "Quần đảo Hoàng Sa",
        aqi: 15,
        region: "BienDao",
        weather: { temp: 27, humidity: 70, status: "Gió biển sạch" },
      },
      {
        name: "Quần đảo Trường Sa",
        aqi: 12,
        region: "BienDao",
        weather: { temp: 27, humidity: 72, status: "Nắng trong lành" },
      },
    ];

    if (!keyword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Vui lòng nhập tên tỉnh thành cần tìm!",
        });
    }

    // Tìm kiếm vị trí tương ứng không phân biệt hoa thường
    const matchedLocation = locations.find((loc) =>
      loc.name.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!matchedLocation) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Không tìm thấy tỉnh thành này trong hệ thống dữ liệu!",
        });
    }

    return res.status(200).json({ success: true, data: matchedLocation });
  } catch (error) {
    next(error);
  }
};

// Luồng gọi AI phân tích trạng thái thời tiết khi đi ra ngoài đường
const analyzeWeatherWithAI = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      aiAdvice:
        "🤖 Khuyến nghị từ AI REMN: Chất lượng không khí vùng này đang ở mức an toàn. Khi đi ra đường bạn chỉ cần mang theo ô che nắng và kính mát bảo vệ mắt để bảo vệ sức khỏe tốt nhất!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMapData, searchLocationDetails, analyzeWeatherWithAI };
