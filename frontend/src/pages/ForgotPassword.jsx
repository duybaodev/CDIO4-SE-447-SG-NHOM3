import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Nhập Email, 2: Nhập OTP & Mật khẩu mới
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Thêm state xác nhận mật khẩu
  const [loading, setLoading] = useState(false);

  // Bước 1: Gọi Backend kiểm tra email và gửi mã OTP khôi phục
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5005/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setStep(2); // Chuyển sang giao diện nhập mã số OTP và đặt lại mật khẩu
        alert(
          data.message || "✓ Mã OTP đã được gửi thành công về Gmail của bạn!"
        );
      } else {
        alert(data.message || "Email không tồn tại trên hệ thống!");
      }
    } catch (err) {
      alert("Không thể kết nối đến máy chủ Backend!");
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác nhận mã OTP và tiến hành đổi mật khẩu mới toàn cục
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Rào chắn bảo mật kiểm tra trùng khớp mật khẩu mới
    if (newPassword !== confirmPassword) {
      alert("⚠️ Mật khẩu nhập lại không trùng khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5005/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otpCode: otpCode.trim(),
          newPassword: newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(
          "🎉 Đổi mật khẩu thành công! Tài khoản đã được cập nhật mật khẩu mới trên Database CDIO4."
        );
        navigate("/login-form"); // Chuyển hướng Bảo về trang đăng nhập của hệ thống
      } else {
        alert(data.message || "Mã OTP không chính xác hoặc đã hết hạn!");
      }
    } catch (err) {
      alert("Lỗi hệ thống xác thực.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] font-sans flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-indigo-500/5 -z-10"></div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full space-y-6 transition-all">
        <div className="text-center">
          <span className="text-3xl block mb-2">
            {step === 1 ? "🔑" : "🔒"}
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            {step === 1 ? "Khôi Phục Mật Khẩu" : "Đặt Lại Mật Khẩu"}
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {step === 1
              ? "Hệ thống bảo mật xác thực danh tính hai lớp qua Gmail của REMN."
              : `Mã xác thực khôi phục đã được gửi đến hòm thư: ${email}`}
          </p>
        </div>

        {/* 🎬 BƯỚC 1: GIAO DIỆN NHẬP EMAIL */}
        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                Nhập Email đã đăng ký
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all"
                placeholder="lehoaibao@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 uppercase tracking-wider"
            >
              {loading
                ? "MÁY CHỦ ĐANG XỬ LÝ..."
                : "🔗 GỬI MÃ XÁC THỰC OTP VỀ GMAIL"}
            </button>
          </form>
        ) : (
          /* 🎬 BƯỚC 2: GIAO DIỆN NHẬP OTP & ĐỔI MẬT KHẨU MỚI */
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider text-center block">
                Nhập mã số xác thực gồm 6 chữ số
              </label>
              <input
                type="text"
                required
                maxLength="6"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg text-center font-mono font-black tracking-widest outline-none focus:border-blue-500 focus:bg-white transition-all text-blue-600"
                placeholder="000000"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                Thiết lập Mật khẩu mới
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all"
                placeholder="Mật khẩu mới của bạn"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                Xác nhận lại mật khẩu mới
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition-all"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 uppercase tracking-wider"
            >
              {loading
                ? "ĐANG ĐỒNG BỘ..."
                : "✓ XÁC NHẬN THIẾT LẬP MẬT KHẨU MỚI"}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => navigate("/login-form")}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Quay lại màn hình đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
