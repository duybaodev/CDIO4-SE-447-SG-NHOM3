const mongoose = require("mongoose");

const MapLocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Tên tỉnh thành (Hà Nội, Đà Nẵng, Quần đảo Hoàng Sa...)
    region: {
      type: String,
      enum: ["Bac", "Trung", "Nam", "BienDao"],
      required: true,
    }, // Bộ lọc vùng miền
    aqi: { type: Number, required: true }, // Chỉ số ô nhiễm không khí tổng quan
    weather: {
      temp: { type: Number, required: true }, // Nhiệt độ hiện tại
      humidity: { type: Number, required: true }, // Độ ẩm hiện tại
      windSpeed: { type: Number, default: 0 }, // Tốc độ gió (Dùng bổ trợ bản đồ Windy)
      status: { type: String, required: true }, // Trạng thái: Nắng nhẹ, Mây mù...

      // 📈 Mảng lưu thời tiết dự kiến theo từng khung giờ (Phục vụ vẽ biểu đồ đường)
      hourlyForecast: [
        {
          time: { type: String }, // "08:00", "12:00", "16:00"...
          temp: { type: Number },
          aqi: { type: Number },
        },
      ],

      // 📅 Mảng lưu dự báo theo ngày (Phục vụ xem thời tiết các ngày tiếp theo)
      dailyForecast: [
        {
          day: { type: String }, // "Hôm nay", "Ngày mai", "Thứ Hai"...
          tempMax: { type: Number },
          tempMin: { type: Number },
          status: { type: String },
        },
      ],
    },
  },
  { timestamps: true }
);
// Thay vì dùng: module.exports = mongoose.model("MapLocation", MapLocationSchema);

// Bảo đổi thành dòng check thông minh này:
module.exports =
  mongoose.models.MapLocation ||
  mongoose.model("MapLocation", MapLocationSchema);
