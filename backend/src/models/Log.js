//(Nhật ký sửa chữa của Kỹ thuật viên)
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true },
  stationId: { type: String, required: true },
  engineer: { type: String, required: true }, // Tên KTV phụ trách ví dụ: Lê Hoài Bảo
  action: { type: String, required: true }, // Nội dung can thiệp phần cứng
  cost: { type: String, default: "0 đ" },
  type: { type: String, default: "Kiểm tra" }, // Thay thế, Sửa chữa, Hiệu chuẩn...
  status: { type: String, enum: ["Success", "Pending"], default: "Pending" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Log", logSchema);
