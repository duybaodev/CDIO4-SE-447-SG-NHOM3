const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendSystemEmail } = require("../services/mailService");
const { OAuth2Client } = require("google-auth-library"); // 🎯 Nạp thư viện chính chủ để giải mã Google Token

// Khởi tạo Client xác thực cấu hình bằng mã Client ID xịn của Bảo
const client = new OAuth2Client(
  "388658501691-cqn3s7m1ldca8vlgp6bju3t6tqgnd9uu.apps.googleusercontent.com"
);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 🎯 LUỒNG 1: ĐĂNG KÝ XONG LÀ BẮN EMAIL CHỨA NÚT BẤM (MAGIC LINK) VÀO THẲNG APP
const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists)
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản hoặc Email đã tồn tại!" });

    // Đăng ký tài khoản (mặc định verified luôn thông qua cơ chế Magic Link nhấn từ Mail)
    const user = await User.create({
      username,
      email,
      password,
      role: role || "user",
      isVerified: true,
    });
    const token = generateToken(user._id);

    // Kích hoạt bắn Mail chứa Nút bấm hành động cao cấp
    await sendSystemEmail(email, { username, token }, "welcome");

    res.status(201).json({
      success: true,
      message:
        "Đăng ký thành công! Thư chào mừng kèm nút đăng nhập thẳng đã được gửi vào Gmail của bạn.",
    });
  } catch (error) {
    next(error);
  }
};

// 🎯 LUỒNG 2: QUÊN MẬT KHẨU (Gửi mã OTP 6 số bảo mật)
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản gắn liền với Email này!",
      });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otpCode;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 phút hiệu lực
    await user.save();

    // Gửi email OTP khôi phục
    await sendSystemEmail(email, { otpCode }, "reset");
    res.status(200).json({
      success: true,
      message: "Mã số OTP khôi phục mật khẩu đã được bắn về Gmail của bạn!",
    });
  } catch (error) {
    next(error);
  }
};

// 🎯 LUỒNG 3: ĐĂNG NHẬP BẰNG GOOGLE (TỰ ĐỘNG ĐỐI CHIẾU HOẶC KHỞI TẠO TÀI KHOẢN MỚI)
const googleLogin = async (req, res, next) => {
  console.log("🌐 [BACKEND] Nhận tín hiệu xử lý đăng nhập bằng Google!");
  const { credential } = req.body;

  if (!credential) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Thiếu mã xác thực danh tính từ Google!",
      });
  }

  try {
    // 1. Xác thực xem chuỗi mã hóa token gửi lên có chuẩn do Google cấp hay không
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience:
        "388658501691-cqn3s7m1ldca8vlgp6bju3t6tqgnd9uu.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // 2. Tra cứu xem Email này đã tồn tại trong Database hệ thống REMN chưa
    let user = await User.findOne({ email });

    if (!user) {
      console.log(
        `✨ Phát hiện Gmail mới, tự động khởi tạo tài khoản cho: ${email}`
      );
      // Nếu chưa có, tự động tạo tài khoản (Cơ chế Auto-Register)
      user = new User({
        username: email.split("@")[0] + Math.floor(1000 + Math.random() * 9000), // Sinh tên tài khoản ngẫu nhiên tránh trùng lặp
        email: email,
        password: Math.random().toString(36).slice(-8), // Sinh mật khẩu ngẫu nhiên để không lỗi cấu trúc Schema
        role: "user", // Quyền hạn mặc định ban đầu
        avatar: picture || "",
        isVerified: true,
      });
      await user.save();
    }

    // 3. Tạo token JWT hệ thống cho tài khoản Google này để đồng bộ với cơ chế bảo mật cũ của Bảo
    const token = generateToken(user._id);

    // 4. Phản hồi thành công về Frontend để xử lý lưu phiên đăng nhập và điều hướng
    return res.status(200).json({
      success: true,
      message: "Đăng nhập bằng tài khoản Google thành công!",
      data: {
        token: token, // Trả token JWT về để Frontend găm vào localStorage làm việc
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error); // Đẩy lỗi ra middleware xử lý tập trung giống form cũ của Bảo
  }
};

// 📦 Xuất bản đồng bộ toàn bộ các hàm xử lý ra bên ngoài file định tuyến Routes
module.exports = { register, forgotPassword, googleLogin };
