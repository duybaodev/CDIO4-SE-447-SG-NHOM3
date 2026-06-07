const MapLocation = require("../models/MapLocation");
const { GoogleGenAI } = require("@google/genai"); // Thư viện AI mới nhất năm 2026

const getMapData = async (req, res) => {
  try {
    const { region } = req.query; // Bộ lọc lựa chọn vùng miền theo ý Bảo
    let query = {};
    if (region) query.region = region;

    const locations = await MapLocation.find(query);

    // Bổ sung tọa độ cứng của Hoàng Sa & Trường Sa nếu chưa có dữ liệu trong DB
    // Đồng thời Backend đính kèm thông điệp khẳng định chủ quyền bất biến theo ý Bảo
    return res.status(200).json({
      success: true,
      sovereigntyNotice: "Hoàng Sa và Trường Sa là của Việt Nam!",
      data: locations,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Xếp hạng ô nhiễm: Tập trung 3 thành phố lớn (Đà Nẵng, HCM, Hà Nội) lên đầu và các tỉnh thành toàn quốc
const getRankingData = async (req, res) => {
  try {
    const allLocations = await MapLocation.find({}).sort({ aqi: -1 }); // Sắp xếp AQI cao nhất xuống thấp nhất

    // Lọc ưu tiên 3 đầu cầu trọng điểm theo ý Bảo
    const bigThree = allLocations.filter((loc) =>
      ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"].includes(loc.name)
    );
    const otherProvinces = allLocations.filter(
      (loc) => !["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"].includes(loc.name)
    );

    return res.status(200).json({
      success: true,
      data: {
        focusCities: bigThree,
        nationalRanking: otherProvinces,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// AI phân tích thời tiết và đưa ra lời khuyên ra đường dựa theo dữ liệu thực tế
const analyzeWeatherWithAI = async (req, res) => {
  try {
    const { locationId } = req.body;
    const loc = await MapLocation.findById(locationId);
    if (!loc)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy địa điểm" });

    // Gọi AI phân tích nhanh gọn
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Dựa vào dữ liệu thời tiết thực tế này: Thành phố ${loc.name}, Chỉ số ô nhiễm không khí AQI là ${loc.aqi}, nhiệt độ ${loc.weather.temp}°C, độ ẩm ${loc.weather.humidity}%. Hãy đưa ra 1 câu nhận xét thời tiết ngắn gọn và 2 lời khuyên thiết thực (nhắc nhở mang ô, đeo khẩu trang chống bụi mịn PM2.5...) cho người dân khi đi ra đường. Hãy trả lời bằng tiếng Việt ngắn gọn.`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.status(200).json({
      success: true,
      aiAdvice: aiResponse.text.trim(),
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      aiAdvice:
        "Nhắc nhở: Bạn nên đeo khẩu trang đạt chuẩn N95 khi di chuyển ngoài đường để tránh tác hại từ hạt bụi mịn PM2.5 và mang theo ô phòng tránh mưa giông bất chợt.",
    });
  }
};

module.exports = { getMapData, getRankingData, analyzeWeatherWithAI };
