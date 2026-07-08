const mongoose = require("mongoose");

const DeviceTaskSchema = new mongoose.Schema(
  {
    deviceName: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["Pending", "Fixing", "Completed"],
      default: "Pending",
    },
    techNote: { type: String, default: "" },
    completedAt: { type: Date },
  },
  { timestamps: true, collection: "devicetasks" }
);

module.exports =
  mongoose.models.DeviceTask || mongoose.model("DeviceTask", DeviceTaskSchema);
