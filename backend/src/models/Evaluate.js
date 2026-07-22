const mongoose = require("mongoose");

const evaluateSchema = new mongoose.Schema(
  {
    evaluateId: {
      type: String,
      required: true,
      unique: true,
    },

    deviceId: {
      type: String,
      required: true,
    },

    stationName: {
      type: String,
      required: true,
    },

    region: {
      type: String,
      enum: ["north", "center", "south"],
      required: true,
    },

    aqi: {
      type: Number,
      required: true,
    },

    pm25: {
      type: Number,
      default: 0,
    },

    pm10: {
      type: Number,
      default: 0,
    },

    temperature: {
      type: Number,
      default: 0,
    },

    humidity: {
      type: Number,
      default: 0,
    },

    airQuality: {
      type: String,
      enum: [
        "Good",
        "Moderate",
        "Unhealthy",
        "Very Unhealthy",
        "Hazardous",
      ],
      default: "Good",
    },

    score: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      default: "",
    },

    evaluatedBy: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "evaluates",
  }
);

module.exports =
  mongoose.models.Evaluate ||
  mongoose.model("Evaluate", evaluateSchema);