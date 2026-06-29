const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    region: {
      type: String,
      enum: ["north", "center", "south"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Disabled", "Offline"],
      default: "Pending",
    },
    cpu: { type: String, default: "15%" },
    ram: { type: String, default: "40%" },
    pm25_status: {
      type: String,
      enum: ["Good", "Calibrating", "Error", "Offline"],
      default: "Good",
    },
    gas_sensor: { type: String, default: "Ổn định" },
    battery: { type: String, default: "100%" },
    signal: { type: String, default: "Tốt (-52 dBm)" },
    lastUpdate: { type: Date, default: Date.now },
  },
  { collection: "devices" }
);

module.exports =
  mongoose.models.Device || mongoose.model("Device", deviceSchema);
