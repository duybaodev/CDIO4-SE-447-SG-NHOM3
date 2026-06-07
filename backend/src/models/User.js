const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "tech", "admin"], default: "user" }, // 3 Phân hệ rõ ràng
  avatar: { type: String, default: "" },

  // Các trường phục vụ bảo mật xác thực Mail OTP
  isVerified: { type: Boolean, default: false },
  otpCode: { type: String, default: null },
  otpExpires: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now },
});

// Cơ chế tự động băm mật khẩu bảo mật trước khi lưu vào MongoDB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Hàm so khớp mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
