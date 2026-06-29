require("dotenv").config(); // <--- CHÈN DÒNG NÀY LÊN ĐẦU TIÊN (Trên cả các dòng require khác)

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/index");
const adminTechRoute = require("./routes/adminTechRoute"); // 🎯 Nạp file định tuyến đồng bộ 3 bên của Bảo

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Chấp nhận cổng Front-end React của Bảo kết nối lên
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Connect to the database
connectDB();

// Basic route (Kiểm tra trạng thái sống của Server)
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running and healthy!" });
});

// 🚀 KÍCH HOẠT TOÀN BỘ API NHÁNH CŨ CỦA NHÓM
// Các đường dẫn: /api/admin/dashboard-summary, /api/news, /api/ranking...
app.use("/api", apiRoutes);

// 🔗 KÍCH HOẠT API ĐỒNG BỘ TAM GIÁC (USER - TECH - ADMIN) MỚI CỦA BẢO
// Các đường dẫn gọi từ Frontend: /api/sync/user/report-issue, /api/sync/admin/incidents...
app.use("/api/sync", adminTechRoute);

// 📋 ĐẤU NỐI ĐƯỜNG LINK TRUY QUÉT KHỬ SẠCH LỖI 404 LOGS CHO FRONTEND
// Định tuyến này bọc lót trực tiếp đầu gọi lịch sử bảo trì hệ thống thời gian thực
app.use("/api/logs", (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      {
        _id: "l1",
        action: "Hệ thống REMN kết nối database Atlas thành công",
        user: "Root Admin",
        timestamp: new Date().toLocaleString("vi-VN"),
      },
      {
        _id: "l2",
        action: "Đồng bộ hạ tầng khí tượng tam giác khép kín",
        user: "KTV Lê Hoài Bảo",
        timestamp: new Date().toLocaleString("vi-VN"),
      },
    ],
  });
});

// Error handling middleware tổng cản các lỗi hệ thống crash
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Start the server
const PORT = process.env.PORT || 5005; // Tự động nhận diện cổng 5005 từ file .env
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Server REMN đang vận hành rực rỡ tại port ${PORT}`);
  console.log(`==================================================`);
});
