const User = require("../models/User");
const { sendSystemEmail } = require("../services/mailService");
const { OAuth2Client } = require("google-auth-library"); // 🎯 Nạp thư viện chính chủ của Google để giải mã Token

// Khởi tạo Client xác thực cấu hình bằng mã Client ID xịn của Bảo
const client = new OAuth2Client(
  "388658501691-cqn3s7m1ldca8vlgp6bju3t6tqgnd9uu.apps.googleusercontent.com"
);

// 🎯 LUỒNG 1: ĐĂNG KÝ TÀI KHOẢN → GỬI EMAIL CHÀO MỪNG
const register = async (req, res) => {
  console.log("🚀 [BACKEND] Tiến trình Đăng ký tài khoản bắt đầu!");
  try {
    const { username, email, password } = req.body;

    // Kiểm tra tài khoản trùng lặp trong database CDIO4
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc Email này đã tồn tại!",
      });
    }

    // Tiến hành lưu tài khoản xuống MongoDB Compass
    await User.create({
      username,
      email,
      password, // Model User sẽ tự động băm mã hóa bảo mật Bcrypt
      role: "user",
    });

    // ✉️ BẮN MAIL CHÀO MỪNG NGAY SAU KHI LƯU DB THÀNH CÔNG
    try {
      await sendSystemEmail(email, { username }, "welcome");
      console.log(`✉️ Đã gửi thư chào mừng đến email: ${email}`);
    } catch (mailErr) {
      console.error(
        "⚠️ Cảnh báo: Lưu tài khoản thành công nhưng cấu hình EMAIL_PASS sai nên chưa bắn được Mail:",
        mailErr.message
      );
    }

    return res.status(201).json({
      success: true,
      message:
        "Đăng ký thành công! Thư chào mừng đã được gửi vào Gmail của bạn.",
    });
  } catch (error) {
    console.error("❌ Lỗi hệ thống đăng ký:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ khi xử lý đăng ký!" });
  }
};

// 🎯 LUỒNG 2: QUÊN MẬT KHẨU BƯỚC 1 & 2 & 3 -> NHẬN EMAIL & SINH MÃ OTP GỬI ĐI
const forgotPassword = async (req, res) => {
  console.log("🔒 [BACKEND] Nhận yêu cầu quên mật khẩu!");
  try {
    const { email } = req.body;

    // Bước 1: Kiểm tra xem email có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(444).json({
        success: false,
        message: "Email này chưa được đăng ký trong hệ thống!",
      });
    }

    // Bước 2: Sinh mã OTP ngẫu nhiên gồm 6 chữ số
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu mã OTP và thời gian hết hạn (5 phút) trực tiếp vào tài khoản user này trong DB
    user.otpCode = otpCode;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Bước 3: Gửi OTP về mail cho người dùng
    try {
      await sendSystemEmail(email, { otpCode }, "reset");
      console.log(`✉️ Đã bắn mã OTP [${otpCode}] về hòm thư: ${email}`);
    } catch (mailErr) {
      console.error(
        "⚠️ Cảnh báo: Lỗi kết nối Gmail, không gửi được OTP:",
        mailErr.message
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Mã số xác thực OTP khôi phục mật khẩu đã được bắn về Gmail của bạn!",
    });
  } catch (error) {
    console.error("❌ Lỗi xử lý Quên mật khẩu:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ khi xử lý cấp mã OTP!" });
  }
};

// 🎯 LUỒNG 2: QUÊN MẬT KHẨU BƯỚC 4 & 5 -> XÁC THỰC MÃ OTP VÀ ĐỔI MẬT KHẨU MỚI THẲNG LUÔN
const resetPassword = async (req, res) => {
  console.log("🔑 [BACKEND] Tiến hành xác thực OTP đổi mật khẩu mới!");
  try {
    const { email, otpCode, newPassword } = req.body;

    // Kiểm tra xem mã OTP nhập vào có đúng và còn trong thời gian hiệu lực 5 phút hay không
    const user = await User.findOne({
      email,
      otpCode,
      otpExpires: { $gt: Date.now() }, // Thời gian hết hạn phải lớn hơn thời gian hiện tại
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Mã số OTP nhập vào không chính xác hoặc đã quá hạn 5 phút!",
      });
    }

    // Nếu đúng mã OTP: Tiến hành cập nhật mật khẩu mới vào Database
    user.password = newPassword;
    user.otpCode = null; // Xóa mã OTP cũ đi để không dùng lại được lần 2
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Đặt lại mật khẩu mới thành công! Giờ bạn có thể đăng nhập lại rực rỡ.",
    });
  } catch (error) {
    console.error("❌ Lỗi xử lý đặt lại mật khẩu:", error.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi cập nhật mật khẩu mới!",
    });
  }
};

// Hàm đăng nhập đối chiếu database
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Tài khoản không tồn tại!" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Mật khẩu không chính xác!" });

    return res
      .status(200)
      .json({ success: true, message: "Đăng nhập thành công!", data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Lỗi đăng nhập!" });
  }
};

// 🎯 LUỒNG 3: ĐĂNG NHẬP BẰNG GOOGLE (TỰ ĐỘNG ĐỐI CHIẾU HOẶC KHỞI TẠO TÀI KHOẢN MỚI)
const googleLogin = async (req, res) => {
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
        `✨ Phát hiện Gmail mới, hệ thống tự động khởi tạo tài khoản cho: ${email}`
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

    // 3. Phản hồi thành công về Frontend để xử lý lưu phiên đăng nhập và điều hướng
    return res.status(200).json({
      success: true,
      message: "Đăng nhập bằng tài khoản Google thành công!",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(
      "❌ Lỗi nghiêm trọng tại hàm googleLogin Controller:",
      error.message
    );
    return res
      .status(500)
      .json({
        success: false,
        message: "Máy chủ xác thực tài khoản Google thất bại!",
      });
  }
};

// 📦 Đồng bộ xuất bản toàn bộ các phân hệ xử lý ra bên ngoài file định tuyến Routes
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  googleLogin,
};
