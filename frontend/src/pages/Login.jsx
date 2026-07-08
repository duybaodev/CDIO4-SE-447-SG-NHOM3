import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; // 🎯 Import nút bấm thông minh bảo mật của Google

const Login = () => {
  const navigate = useNavigate();

  // 1. Khởi tạo các State quản lý dữ liệu Input nhập từ người dùng
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Hiệu ứng Micro-interaction di chuột di chuyển các khối background tròn
  useEffect(() => {
    const handleMouseMove = (e) => {
      const shapes = document.querySelectorAll(".floating-shape");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 🎯 2. HÀM XỬ LÝ LỆNH ĐĂNG NHẬP GỌI API THẬT XUỐNG BACKEND EXPRESS
  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // Chặn hành vi tải lại trang mặc định của form

    // Kiểm tra tính hợp lệ dữ liệu đầu vào cơ bản
    if (!username.trim() || !password.trim()) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin Tài khoản và Mật khẩu!");
      return;
    }

    setLoading(true);

    try {
      // Thọc API trực tiếp lên cổng 5005 mà anh em mình đã cấu hình
      const response = await fetch("http://localhost:5005/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        // Găm mã Token bảo mật danh tính và quyền hạn vào bộ nhớ Trình duyệt
        localStorage.setItem("REMN_USER_TOKEN", result.data.token);
        localStorage.setItem("REMN_USER_ROLE", result.data.role);

        // 🟢 ĐÃ BỔ SUNG: Lưu giữ nguyên vẹn Object định danh tài khoản thật từ database để thông mạch Profile & Báo lỗi
        localStorage.setItem("REMN_CURRENT_USER", JSON.stringify(result.data));

        alert(
          `🎉 Đăng nhập thành công! Chào mừng Kỹ sư ${result.data.username} trở lại.`
        );

        // Phân luồng điều hướng trang dựa theo chức vụ (Role) được lưu trong MongoDB (Hóa giải chữ Hoa/Thường)
        const userRole = result.data.role
          ? result.data.role.toLowerCase()
          : "user";
        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "tech") {
          navigate("/tech/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        // Hiện thông báo lỗi trả về từ kiến trúc Backend
        alert(`❌ Lỗi đăng nhập: ${result.message}`);
      }
    } catch (error) {
      alert("❌ Lỗi kết nối: Không thể liên lạc được với máy chủ Backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen w-full flex items-center justify-center font-sans overflow-x-hidden relative">
      {/* Ambient Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="floating-shape absolute rounded-full filter blur-[60px] transition-transform duration-300 ease-out bg-primary/20 w-[600px] h-[600px] -top-20 -left-20"></div>
        <div className="floating-shape absolute rounded-full filter blur-[60px] transition-transform duration-300 ease-out bg-secondary-container/20 w-[500px] h-[500px] bottom-0 right-0"></div>
      </div>

      {/* Main Container: Split Layout */}
      <main className="w-full max-w-[1440px] min-h-[850px] lg:h-[921px] grid grid-cols-1 md:grid-cols-2 bg-white/40 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl border border-white/30 mx-4 md:mx-10 relative z-10">
        {/* Left Side: Form Section */}
        <section className="flex flex-col justify-between p-8 lg:p-16 relative z-10 bg-white/20">
          <div className="mb-10">
            <Link
              to="/"
              className="text-3xl font-black text-primary tracking-tight hover:opacity-80 transition-all"
            >
              REMN
            </Link>
          </div>

          <div className="max-w-[420px] mx-auto w-full my-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-on-surface tracking-tight">
                Chào mừng trở lại
              </h1>
              <p className="text-sm text-text-muted">
                Theo dõi và phân tích chất lượng không khí của bạn ngay bây giờ.
              </p>
            </div>

            {/* 🔥 FORM ĐÂ ĐƯỢC ĐỒNG BỘ LUỒNG INPUT ĐỂ TEST WEB DỮ LIỆU THẬT */}
            <form className="space-y-5" onSubmit={handleLoginSubmit}>
              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-2"
                  htmlFor="username"
                >
                  Tên tài khoản (Username)
                </label>
                <input
                  className="w-full px-4 py-3 bg-white/60 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none font-semibold"
                  id="username"
                  placeholder="Nhập tài khoản của Bảo..."
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    className="block text-sm font-medium text-on-surface-variant"
                    htmlFor="password"
                  >
                    Mật khẩu
                  </label>

                  {/* 🔗 ĐÃ LIÊN KẾT: Chuyển hướng mượt mà sang trang Quên mật khẩu OTP mới */}
                  <Link
                    className="text-sm font-bold text-blue-600 hover:underline transition-all"
                    to="/forgot-password"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <input
                  className="w-full px-4 py-3 bg-white/60 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none font-semibold"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <input
                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary bg-white/50 accent-primary"
                  id="remember"
                  type="checkbox"
                />
                <label
                  className="ml-2 text-sm text-on-surface-variant select-none"
                  htmlFor="remember"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              {/* Nút bấm tự động khóa trạng thái khi đang gửi yêu cầu lên máy chủ */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#0058be] hover:bg-blue-700 text-white rounded-xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 mt-2 disabled:opacity-50"
              >
                {loading ? "MÁY CHỦ ĐANG XỬ LÝ..." : "ĐĂNG NHẬP HỆ THỐNG"}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-text-muted font-medium">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            {/* 🔥 PHÂN HỆ NÚT BẰNG MẠNG XÃ HỘI (ĐÃ ĐỒNG BỘ NÚT GOOGLE XỊN) */}
            <div className="grid grid-cols-2 gap-4 items-center">
              {/* Nút đăng nhập Google thông minh, tự động render chuẩn xác giao diện và kích hoạt bảo mật */}
              <div className="w-full flex justify-center GoogleLogin-Container">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    console.log(
                      "🎯 Token danh tính từ Google Cloud:",
                      credentialResponse
                    );
                    try {
                      const res = await fetch(
                        "http://localhost:5005/api/auth/google-login",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            credential: credentialResponse.credential,
                          }),
                        }
                      );

                      const result = await res.json();

                      if (result.success) {
                        alert("🎉 Đăng nhập bằng tài khoản Google thành công!");

                        // Lưu trữ dữ liệu cấu trúc thực tế vào hệ thống trình duyệt
                        localStorage.setItem(
                          "REMN_USER_TOKEN",
                          result.data._id
                        );
                        localStorage.setItem(
                          "REMN_USER_ROLE",
                          result.data.role
                        );

                        // 🟢 ĐÃ BỔ SUNG: Găm danh tính thật của tài khoản Google Cloud vào cùng một key đồng bộ
                        localStorage.setItem(
                          "REMN_CURRENT_USER",
                          JSON.stringify(result.data)
                        );

                        // Điều hướng mượt mà dựa theo chức vụ của tài khoản Google vừa trả về (Hóa giải chữ Hoa/Thường)
                        const googleUserRole = result.data.role
                          ? result.data.role.toLowerCase()
                          : "user";
                        if (googleUserRole === "admin") {
                          navigate("/admin/dashboard");
                        } else if (googleUserRole === "tech") {
                          navigate("/tech/dashboard");
                        } else {
                          navigate("/dashboard");
                        }
                      } else {
                        alert(`❌ Lỗi xác thực: ${result.message}`);
                      }
                    } catch (err) {
                      alert(
                        "❌ Lỗi kết nối: Không thể xử lý đồng bộ Google với máy chủ Backend!"
                      );
                    }
                  }}
                  onError={() => {
                    alert("❌ Đăng nhập bằng Google không thành công!");
                  }}
                  useOneTap
                  theme="outline"
                  shape="rectangular"
                  locale="vi"
                />
              </div>

              {/* Giữ nguyên nút Facebook làm giao diện thẩm mỹ để tránh lỗi HTTPS ở môi trường localhost */}
              <button
                type="button"
                onClick={() =>
                  alert(
                    "🤖 Tính năng đăng nhập Facebook yêu cầu giao thức bảo mật mã hóa HTTPS bảo vệ nghiêm ngặt, hệ thống sẽ cập nhật khi deploy production nhé!"
                  )
                }
                className="flex items-center justify-center gap-2 py-2 px-4 h-[40px] border border-outline-variant rounded bg-white hover:bg-slate-50 transition-all text-sm font-medium active:scale-[0.98]"
              >
                <svg
                  className="w-5 h-5 text-[#1877F2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
                Facebook
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-text-muted">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-bold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </section>

        {/* Right Side: Visual Section */}
        <section className="hidden md:block relative h-full overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10"></div>
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt="Môi trường núi sương mù"
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 bg-gradient-to-t from-slate-900/90 to-transparent">
            <div className="max-w-[480px]">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-semibold uppercase tracking-wider">
                  Trực tuyến
                </span>
                <span className="text-white/80 text-xs">
                  Cập nhật 2 phút trước
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                Hơi thở trong lành cho một cuộc sống tươi đẹp.
              </h2>
              <p className="text-sm text-white/90 leading-relaxed">
                Tham gia cùng hơn 10.000 chuyên gia đang sử dụng REMN để giám
                sát chất lượng không khí thời gian thực trên toàn cầu.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
