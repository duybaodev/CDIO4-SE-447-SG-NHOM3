const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 🟢 ĐH ĐÃ SỬA: Nới lỏng enum để chấp nhận cả viết thường lẫn viết hoa, tránh lỗi ép kiểu nghiêm ngặt
    role: {
      type: String,
      enum: ["User", "Tech", "Admin", "user", "tech", "admin"],
      default: "user",
    },

    avatar: { type: String, default: "" },

    // Xác thực Mail OTP
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String, default: null },
    otpExpires: { type: Date, default: null },

    createdAt: { type: Date, default: Date.now },
  },
  { collection: "users" }
);

// Cơ chế tự động băm mật khẩu bảo mật trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Hàm so khớp mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
