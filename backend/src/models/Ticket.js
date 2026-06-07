const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  stationId: { type: String, required: true },
  issue: { type: String, required: true },
  priority: {
    type: String,
    enum: ["Cao", "Trung bình", "Thấp"],
    default: "Trung bình",
  },
  assignee: { type: String, required: true },
  stage: {
    type: String,
    enum: ["Đang kiểm tra", "Đang sửa chữa", "Chờ linh kiện", "Hoàn thành"],
    default: "Đang kiểm tra",
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
