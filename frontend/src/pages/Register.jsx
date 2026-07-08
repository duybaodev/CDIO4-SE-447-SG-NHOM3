import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  // State quản lý xem trước Avatar
  const [avatarSrc, setAvatarSrc] = useState(null);

  // 🎯 Bộ State quản lý dữ liệu Input đồng bộ chuẩn xác với cấu trúc Backend
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State quản lý độ mạnh mật khẩu
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [strengthText, setStrengthText] = useState("Độ mạnh mật khẩu");

  // State quản lý Toast thông báo
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("Đang xử lý...");
  const [toastIcon, setToastIcon] = useState("info");
  const [toastIconColor, setToastIconColor] = useState("#0058be");

  // 1. Logic sinh hạt bay ngầm (Weather Particles)
  useEffect(() => {
    const container = document.getElementById("particle-container");
    if (!container) return;
    container.innerHTML = "";
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "weather-particle";

      const size = Math.random() * 8 + 4 + "px";
      particle.style.width = size;
      particle.style.height = size;
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";

      const duration = Math.random() * 10 + 10 + "s";
      particle.style.setProperty("--duration", duration);

      const delay = Math.random() * 10 + "s";
      particle.style.animationDelay = delay;

      container.appendChild(particle);
    }
  }, []);

  // 2. Logic tính toán độ mạnh mật khẩu khi Bảo gõ chữ
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);

    let score = 0;
    if (val.length > 5) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    setStrength(score);

    const labels = ["Yếu", "Trung bình", "Khá mạnh", "Rất mạnh"];
    setStrengthText(
      val ? `Mật khẩu: ${labels[score - 1] || "Yếu"}` : "Độ mạnh mật khẩu"
    );
  };

  // 3. Xử lý đổi file ảnh đại diện
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarSrc(URL.createObjectURL(file));
    }
  };

  // 🎯 4. XỬ LÝ SUBMIT FORM VÀ GỌI API ĐĂNG KÝ THỰC TẾ
  const handleSubmit = async (e) => {
    e.preventDefault(); // Chặn hành vi load lại trang mặc định

    // Rào chắn bảo mật kiểm tra trùng khớp mật khẩu nhập vào
    if (password !== confirmPassword) {
      setToastMsg("Mật khẩu xác nhận không trùng khớp!");
      setToastIcon("info");
      setToastIconColor("#EF4444");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
      return;
    }

    // Bật hiệu ứng Toast thông báo trạng thái chờ xử lý gửi Mail
    setToastVisible(true);
    setToastMsg("Đang xử lý đăng ký và gửi Mail...");
    setToastIcon("info");
    setToastIconColor("#0058be");

    try {
      // 🚀 Thực hiện bắn dữ liệu chính xác lên cổng 5005 của Backend Express
      const response = await fetch("http://localhost:5005/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(), // Đảm bảo lọc bỏ dấu cách thừa nếu có
          email: email.trim(),
          password: password,
          role: "user",
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Cập nhật Toast thông báo trạng thái nổ chuông Gmail thành công
        setToastMsg("Đăng ký thành công! Hãy kiểm tra hộp thư Gmail của bạn.");
        setToastIcon("verified");
        setToastIconColor("#22C55E");

        // Giữ thông báo hiển thị 3.5 giây để người dùng đọc rồi chuyển hướng về trang đăng nhập
        setTimeout(() => {
          setToastVisible(false);
          navigate("/login-form");
        }, 3500);
      } else {
        // Bóc tách lỗi hệ thống hoặc trùng lặp tài khoản từ MongoDB trả ngược về giao diện
        setToastMsg(result.message || "Tài khoản hoặc Email đã tồn tại!");
        setToastIcon("info");
        setToastIconColor("#EF4444");
        setTimeout(() => setToastVisible(false), 4000);
      }
    } catch (error) {
      setToastMsg("Không thể kết nối đến Máy chủ Backend Express!");
      setToastIcon("info");
      setToastIconColor("#EF4444");
      setTimeout(() => setToastVisible(false), 4000);
    }
  };

  // Hàm trả màu cho thanh đo độ mạnh mật khẩu
  const getBarColor = (index) => {
    if (index >= strength) return "#e2e7ff";
    if (strength === 1) return "#EF4444";
    if (strength === 2) return "#F97316";
    if (strength === 3) return "#EAB308";
    if (strength === 4) return "#22C55E";
    return "#e2e7ff";
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] font-sans overflow-hidden h-screen w-full relative">
      <main className="flex h-full w-full">
        {/* LEFT SIDE: Weather Animation & Image Display */}
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-50 to-emerald-50 z-0">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              alt="Môi trường thiên nhiên tươi sạch"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7IReJdygtHtdULiADM4uuI7gKM6FRPo8VyfR7rk8LHmtxSE2nWd5AuXhTb_VnoBO98RLRODHTmQUnqvKjr9eQi86z3HY18kp_AVZfz8Faxq9-uxin0HUn0n4dr6eXrkobGqrGo8Opt2mGsrfeXgq2ve4XpJOe7gikGJMTytwsk_BOsoFd2D3OCVsQkqGSMfScHo3unYz5Ia591DktWyJvmG6ZbAtGCR2hoj7H9ef_nyN5029jlgXmcsvq3I0OsdQ6JudlElcIDsA"
            />
          </div>
          <div className="absolute inset-0 z-10" id="particle-container"></div>

          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-center bg-black/5">
            <h1 className="text-5xl font-black text-white drop-shadow-2xl mb-6 leading-tight">
              Hơi thở trong lành
              <br />
              cho cuộc sống tươi đẹp
            </h1>
            <p className="text-base text-white/90 max-w-md drop-shadow-md">
              Tham gia cộng đồng REMN để theo dõi chất lượng không khí thời gian
              thực và bảo vệ sức khỏe gia đình bạn.
            </p>

            {/* Live AQI Badge */}
            <div className="mt-8 bg-white/70 backdrop-blur-md px-6 py-4 rounded-2xl flex items-center gap-4 shadow-xl border border-white/40 animate-bounce">
              <div className="w-11 h-11 rounded-full bg-[#22C55E] flex items-center justify-center text-white font-bold text-xl">
                ✓
              </div>
              <div className="text-left text-slate-800">
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                  Trạng thái hệ thống
                </div>
                <div className="text-base font-bold text-[#22C55E]">
                  AQI: 12 (Tuyệt vời)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE: Registration Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#faf8ff] overflow-y-auto z-10 h-full">
          <div className="w-full max-w-[480px] my-auto py-6">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-[#0058be] tracking-tight">
                  Tạo tài khoản mới
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Bắt đầu hành trình sống xanh cùng REMN
                </p>
              </div>
              <Link
                to="/"
                className="h-12 w-12 bg-[#0058be]/10 rounded-xl flex items-center justify-center text-2xl hover:bg-[#0058be]/20 active:scale-95 transition-all cursor-pointer select-none"
                title="Quay về trang chủ"
              >
                🌱
              </Link>
            </div>

            {/* Registration Form Box */}
            <form
              onSubmit={handleSubmit}
              className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/50 flex flex-col gap-4"
            >
              {/* Avatar Upload Selection */}
              <div className="flex items-center gap-4 mb-1">
                <div className="relative group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-[#0058be]/30 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#0058be]">
                    {avatarSrc ? (
                      <img
                        className="w-full h-full object-cover"
                        src={avatarSrc}
                        alt="Avatar"
                      />
                    ) : (
                      <span className="text-2xl opacity-40">📷</span>
                    )}
                  </div>
                  <input
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    type="file"
                  />
                </div>
                <div>
                  <span className="text-sm font-bold block text-slate-800">
                    Ảnh đại diện
                  </span>
                  <span className="text-xs text-slate-400">
                    Tùy chọn: Tải lên hình cá nhân
                  </span>
                </div>
              </div>

              {/* Grid 1: Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] outline-none transition-all text-sm font-semibold"
                    placeholder="Họ và tên"
                  />
                </div>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] outline-none transition-all text-sm font-semibold"
                    placeholder="Tên đăng nhập"
                  />
                </div>
              </div>

              {/* Grid 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] outline-none transition-all text-sm font-semibold"
                    placeholder="Email nhận mã"
                  />
                </div>
                <div className="relative">
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] outline-none transition-all text-sm font-semibold"
                    placeholder="Số điện thoại"
                  />
                </div>
              </div>

              {/* City Selection dropdown */}
              <div className="relative">
                <select
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] outline-none transition-all text-sm appearance-none text-slate-700 font-semibold"
                >
                  <option value="" disabled>
                    Thành phố quan tâm
                  </option>
                  <option value="hanoi">Hà Nội</option>
                  <option value="hcm">TP. Hồ Chí Minh</option>
                  <option value="danang">Đà Nẵng</option>
                  <option value="cantho">Cần Thơ</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </span>
              </div>

              {/* Password fields */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] outline-none transition-all text-sm font-semibold"
                    placeholder="Mật khẩu"
                  />
                  {/* Password Strength Meter Bars */}
                  <div className="mt-2 flex gap-1 h-1">
                    <div
                      className="flex-1 rounded-full transition-all duration-300"
                      style={{ backgroundColor: getBarColor(0) }}
                    ></div>
                    <div
                      className="flex-1 rounded-full transition-all duration-300"
                      style={{ backgroundColor: getBarColor(1) }}
                    ></div>
                    <div
                      className="flex-1 rounded-full transition-all duration-300"
                      style={{ backgroundColor: getBarColor(2) }}
                    ></div>
                    <div
                      className="flex-1 rounded-full transition-all duration-300"
                      style={{ backgroundColor: getBarColor(3) }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 mt-1 block">
                    {strengthText}
                  </span>
                </div>

                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] outline-none transition-all text-sm font-semibold"
                  placeholder="Xác nhận mật khẩu"
                />
              </div>

              {/* Checkbox Terms Agreement */}
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <input
                  required
                  className="mt-1 h-4 w-4 text-primary border-slate-200 rounded focus:ring-0 accent-primary"
                  type="checkbox"
                />
                <span className="text-xs text-slate-500 group-hover:text-slate-800 transition-colors leading-relaxed">
                  Tôi đồng ý với{" "}
                  <a
                    className="text-primary font-bold hover:underline"
                    href="#"
                  >
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a
                    className="text-primary font-bold hover:underline"
                    href="#"
                  >
                    Chính sách bảo mật
                  </a>{" "}
                  của REMN.
                </span>
              </label>

              {/* Submit Action Button */}
              <button
                type="submit"
                className="w-full py-3.5 mt-1 bg-gradient-to-r from-[#0058be] to-[#00687a] text-white font-bold rounded-xl active:scale-[0.99] hover:opacity-95 shadow-lg shadow-blue-700/20 transition-all flex items-center justify-center gap-2 group text-sm uppercase tracking-wider"
              >
                <span>Đăng ký ngay</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  ➔
                </span>
              </button>

              {/* Link navigation back to Welcome/Login layout */}
              <p className="text-center text-xs text-slate-500 mt-1">
                Đã có tài khoản?{" "}
                <Link
                  to="/login-form"
                  className="text-[#0058be] font-bold hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </form>

            {/* Custom Interactive Toast Notification */}
            <div
              className={`fixed bottom-6 right-6 bg-white/95 backdrop-blur-md px-6 py-4 rounded-xl shadow-2xl transition-all duration-500 flex items-center gap-3 border border-slate-100 z-50 ${
                toastVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-24 opacity-0 pointer-events-none"
              }`}
            >
              <span
                className="font-black text-xl"
                style={{ color: toastIconColor }}
              >
                {toastIcon === "verified" ? "✓" : "ℹ"}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {toastMsg}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;
