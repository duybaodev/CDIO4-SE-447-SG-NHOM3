import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Đã nạp useNavigate ở đây

const Login = () => {
  const navigate = useNavigate(); // Bước 1: Khởi tạo công cụ chuyển trang thần tốc

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

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen w-full flex items-center justify-center font-sans overflow-x-hidden relative">
      {/* 1. Ambient Background Decorations (Các khối tròn mờ bay mượt mà) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="floating-shape absolute rounded-full filter blur-[60px] transition-transform duration-300 ease-out bg-primary/20 w-[600px] h-[600px] -top-20 -left-20"></div>
        <div className="floating-shape absolute rounded-full filter blur-[60px] transition-transform duration-300 ease-out bg-secondary-container/20 w-[500px] h-[500px] bottom-0 right-0"></div>
        <div className="floating-shape absolute rounded-full filter blur-[60px] transition-transform duration-300 ease-out bg-tertiary-container/10 w-[400px] h-[400px] top-1/2 left-1/3"></div>
      </div>

      {/* 2. Main Container: Split Layout (Khung kính mờ chia đôi) */}
      <main className="w-full max-w-[1440px] min-h-[850px] lg:h-[921px] grid grid-cols-1 md:grid-cols-2 bg-white/40 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl border border-white/30 mx-4 md:mx-10 relative z-10">
        {/* Left Side: Form Section */}
        <section className="flex flex-col justify-between p-8 lg:p-16 relative z-10 bg-white/20">
          {/* Brand Logo - Ấn vào quay về Welcome */}
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

            {/* Login Form */}
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="w-full px-4 py-3 bg-white/60 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
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
                  <a
                    className="text-sm font-medium text-primary hover:underline transition-all"
                    href="#"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <input
                  className="w-full px-4 py-3 bg-white/60 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                  id="password"
                  placeholder="••••••••"
                  type="password"
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

              {/* Bước 2: Gắn sự kiện onClick nhảy vút sang trang chủ Dashboard */}
              <button
                type="submit"
                onClick={() => navigate("/dashboard")}
                className="w-full py-3.5 bg-primary hover:bg-primary-container text-white rounded-xl font-semibold transition-all active:scale-[0.98] shadow-lg shadow-primary/20 mt-2"
              >
                Đăng nhập
              </button>
            </form>

            {/* Social Login Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-4 text-text-muted font-medium">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-outline-variant rounded-xl bg-white/60 hover:bg-slate-50 transition-all text-sm font-medium active:scale-[0.98]">
                <img
                  alt="Google"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLF0W0JvDxEmaBAVU1SljS9TXYpcfB7IKHR5gPR5SVcRElcU_BGlBM34r9Au0RkYfoNFxn994SJ5f5D8JmPZUORXDQeiCEtFkG6SWtmUg2-0MG5Cwmlb3THi-j5oFEVNC2Xd4kBEYPmhtLWibeWS_PA0Pjqza2zD1hA5VPdBRqSrsL88RK_V2BkE_ES9-IiVDG-anwy5H4m3cKG89TGG5RfoZVezwc9rsC-JTZnOyGbDQhYouq35TaDlfFByauKFZ2i3hXiRlcYu4"
                />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-outline-variant rounded-xl bg-white/60 hover:bg-slate-50 transition-all text-sm font-medium active:scale-[0.98]">
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

          {/* Footer links - Đã liên kết sang trang Đăng ký bằng Link */}
          <div className="mt-8 text-center text-sm text-text-muted">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-primary font-bold hover:underline"
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
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGfI26OjOp72gxUE49qzJWtGMijbJGxOj1OYgLi1Kxq6R3uyz7LInZ2EEU4TmWIT2C7P1g6SO9QFw8mvNt60-7pTIn1AHIdBXcimDRxNaDIC1Op3GdmjwmLy4U0hegukAqPY-ScG_ZN6UNq3fyd_ipFplcq_4WGzLSpKz10OUXnLiK9SDLcb1ZjpJDhFo3BI-O91ZJwMZVFKyeAeY6COwDgXbEdjaYesbyOSmYFAtnNWVTSKparyLatt6ReMzGiVPO-qPIrEHVZLk"
          />
          {/* Overlay Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 bg-gradient-to-t from-primary/90 to-transparent">
            <div className="max-w-[480px]">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-aqi-good text-white rounded-full text-xs font-semibold uppercase tracking-wider">
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

          {/* Floating Data Widgets for Visual Flair */}
          <div className="absolute top-10 right-10 z-20 bg-white/70 backdrop-blur-md p-5 rounded-2xl w-[200px] border border-white/30 shadow-lg animate-bounce duration-1000">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-medium">
                AQI Hiện tại
              </span>
              <span className="text-aqi-good font-bold text-xs">●</span>
            </div>
            <div className="text-4xl font-black text-on-surface">12</div>
            <div className="text-aqi-good font-bold text-xs mt-1">Rất tốt</div>
          </div>

          <div className="absolute top-44 left-10 z-20 bg-white/70 backdrop-blur-md p-3.5 rounded-xl border border-white/30 shadow-md flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-aqi-good rounded-full animate-ping"></div>
            <span className="text-on-surface text-xs font-bold">
              Đà Nẵng, Việt Nam
            </span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
