require("dotenv").config(); // <--- CHÈN DÒNG NÀY LÊN ĐẦU TIÊN (Trên cả các dòng require khác)

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/index");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Connect to the database
connectDB();

// Basic route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running and healthy!" });
});

// 🚀 CHÈN DÒNG NÀY VÀO ĐÂY ĐỂ KÍCH HOẠT TOÀN BỘ API NHÁNH
app.use("/api", apiRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
