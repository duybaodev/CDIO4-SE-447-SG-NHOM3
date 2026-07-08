const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MapLocation",
      required: true,
    },
    issueDescription: { type: String, required: true },
    assignedTechId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // 🟢 Đã liên kết dạng ObjectId chuẩn chỉ đến bộ cơ sở users
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true, collection: "incidents" }
);

module.exports =
  mongoose.models.Incident || mongoose.model("Incident", IncidentSchema);
