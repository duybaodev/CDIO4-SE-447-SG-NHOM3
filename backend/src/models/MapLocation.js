const mongoose = require("mongoose");

const MapLocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    region: {
      type: String,
      enum: ["Bac", "Trung", "Nam", "BienDao"],
      required: true,
    },
    aqi: { type: Number, required: true, default: 50 },
    status: {
      type: String,
      enum: ["Active", "Pending", "Disabled", "Offline"],
      default: "Active",
    },
    weather: {
      temp: { type: Number, required: true },
      humidity: { type: Number, required: true },
      windSpeed: { type: Number, default: 0 },
      status: { type: String, required: true },
      hourlyForecast: [
        {
          time: { type: String },
          temp: { type: Number },
          aqi: { type: Number },
        },
      ],
      dailyForecast: [
        {
          day: { type: String },
          tempMax: { type: Number },
          tempMin: { type: Number },
          status: { type: String },
        },
      ],
    },
    // 🟢 TÍCH HỢP: Thông số vi mạch đồng bộ real-time với phân hệ Devices và TechDashboard
    hardwareSpecs: {
      cpuUsage: { type: Number, default: 12 },
      ramUsage: { type: Number, default: 42 },
      sensorStatus: { type: String, default: "Ổn định" },
      batteryLevel: { type: String, default: "100%" },
      signalStrength: { type: String, default: "Tốt (-52 dBm)" },
    },
  },
  { timestamps: true, collection: "maplocations" }
);

module.exports =
  mongoose.models.MapLocation ||
  mongoose.model("MapLocation", MapLocationSchema);
