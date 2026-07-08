const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Nạp file .env nằm ở thư mục gốc backend
dotenv.config({ path: path.join(__dirname, "../.env") });

// SỬA LẠI ĐƯỜNG DẪN NÀY: Vì file seed.js đứng cùng cấp thư mục với models/ nên dùng './models/...'
const Device = require("./models/Device");
const Ticket = require("./models/Ticket");
const News = require("./models/News");
const Ranking = require("./models/Ranking");
const User = require("./models/User"); // Nạp thêm model User để tí bơm tài khoản đăng nhập

const seedData = async () => {
  try {
    // Kết nối thẳng vào chuỗi URI trong file .env (mongodb://127.0.0.1:27017/CDIO4)
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("[SEED] Đang làm sạch các bảng tiếng Anh cũ...");

    await Device.deleteMany({});
    await Ticket.deleteMany({});
    await News.deleteMany({});
    await Ranking.deleteMany({});
    await User.deleteMany({});

    console.log("[SEED] Đang bơm dữ liệu thật trọn gói...");

    // 1. Bơm tài khoản Admin mặc định để Bảo đăng nhập test Web ngay lập tức
    await User.create({
      username: "lehoaibao",
      email: "baole@example.com",
      password: "password123", // Code model User sẽ tự động băm mật khẩu này bảo mật
      role: "admin",
      isVerified: true,
    });

    // 2. Bơm data trạm IoT khí quyển
    await Device.create([
      {
        deviceId: "ST-001",
        name: "Trạm Hải Châu (Trung tâm)",
        region: "center",
        status: "Active",
      },
      {
        deviceId: "ST-009",
        name: "Trạm KCN Hòa Khánh",
        region: "center",
        status: "Active",
      },
    ]);

    // 3. Bơm data Phiếu sửa chữa
    await Ticket.create([
      {
        ticketId: "TK-901",
        stationId: "ST-001",
        issue: "Hỏng cảm biến vi bụi PM2.5",
        priority: "Cao",
        assignee: "Lê Hoài Bảo",
        stage: "Đang kiểm tra",
      },
    ]);

    // 4. Bơm dữ liệu Tin tức môi trường
    await News.create([
      {
        title:
          "Đà Nẵng triển khai hệ thống quan trắc không khí thông minh REMN",
        summary:
          "Ứng dụng chính thức đi vào vận hành thử nghiệm tại các quận trọng điểm.",
        content: "Nội dung chi tiết...",
      },
    ]);

    // 5. Bơm dữ liệu Xếp hạng 3 miền
    await Ranking.create([
      {
        rank: 1,
        city: "Đà Nẵng",
        aqi: 32,
        status: "Chất lượng tốt",
        pm25: "7.4 µg/m³",
        region: "center",
      },
      {
        rank: 2,
        city: "Hà Nội",
        aqi: 142,
        status: "Chất lượng kém",
        pm25: "52.1 µg/m³",
        region: "north",
      },
    ]);

    console.log("==================================================");
    console.log("🎉 [SUCCESS] ĐÃ NẠP DATA SẠCH VÀO DATABASE CDIO4 THÀNH CÔNG!");
    console.log("==================================================");
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi seed dữ liệu:", error);
    process.exit(1);
  }
};

seedData();
