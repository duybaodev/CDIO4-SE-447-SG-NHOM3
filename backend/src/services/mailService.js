const nodemailer = require("nodemailer");

// Khởi tạo cấu hình kết nối tới Server Gmail của Google
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    // Đảm bảo trong file .env Bảo đã điền MẬT KHẨU ỨNG DỤNG 16 ký tự lấy từ Google
    pass: process.env.EMAIL_PASS,
  },
});

// Hàm tổng lực gửi mail hệ thống dựa theo cấu trúc Bảo yêu cầu
const sendSystemEmail = async (toEmail, data, type) => {
  let subject = "";
  let htmlContent = "";

  if (type === "welcome") {
    subject = "🎉 Đăng ký tài khoản thành công - Chào mừng bạn đến với REMN!";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2ec4b6;">Đăng ký thành công!</h2>
        <p>Xin chào <strong>${data.username}</strong>,</p>
        <p>Tài khoản của bạn đã được tạo thành công trên hệ thống giám sát môi trường REMN.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${toEmail}</p>
          <p style="margin: 5px 0;"><strong>Ngày đăng ký:</strong> ${new Date().toLocaleDateString(
            "vi-VN"
          )}</p>
        </div>
        <p>Chúc bạn có những trải nghiệm tuyệt vời cùng đồ án CDIO 4!</p>
      </div>
    `;
  } else if (type === "reset") {
    subject = "🔒 Mã xác thực đặt lại mật khẩu của bạn";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h3 style="color: #e63946;">Yêu cầu cấp lại mật khẩu</h3>
        <p>Chào bạn, chúng tôi nhận được yêu cầu đặt lại mật khẩu từ bạn.</p>
        <p>Mã xác thực đặt lại mật khẩu của bạn là:</p>
        <div style="background-color: #f1faee; border: 2px dashed #e63946; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #e63946;">${data.otpCode}</span>
        </div>
        <p style="color: #666; font-size: 13px;">⚠️ Mã này có hiệu lực trong vòng <strong>5 phút</strong>. Tuyệt đối không chia sẻ mã này cho bất kỳ ai.</p>
      </div>
    `;
  }

  // Tiến hành phát lệnh gửi mail đi thật
  await transporter.sendMail({
    from: `"Hệ thống REMN 2026" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: htmlContent,
  });
};

module.exports = { sendSystemEmail };
