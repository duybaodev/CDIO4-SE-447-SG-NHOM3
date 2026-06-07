const mongoose = require("mongoose");

const rankingSchema = new mongoose.Schema({
  rank: { type: Number, required: true },
  city: { type: String, required: true, unique: true },
  aqi: { type: Number, required: true },
  status: { type: String, required: true }, // Tốt, Trung bình, Kém, Xấu...
  pm25: { type: String, required: true },
  region: { type: String, enum: ["north", "center", "south"], required: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ranking", rankingSchema);
