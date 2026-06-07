const mongoose = require("mongoose");

const DeviceTaskSchema = new mongoose.Schema(
  {
    deviceName: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true }, // Tình trạng hư hỏng
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ID Kỹ thuật viên
    status: {
      type: String,
      enum: ["Pending", "Fixing", "Completed"],
      default: "Pending",
    },
    techNote: { type: String, default: "" }, // Ghi chú từ kỹ thuật viên khi sửa xong
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeviceTask", DeviceTaskSchema);
