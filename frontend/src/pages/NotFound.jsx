import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const [currentStat, setCurrentStat] = useState("Bình thường");

  // Giữ nguyên logic micro-interaction mô phỏng bầu không khí sống động của Bảo
  useEffect(() => {
    const stats = ["Bình thường", "Ổn định", "Đang quét..."];
    let index = 0;
    const intervalId = setInterval(() => {
      index = (index + 1) % stats.length;
      setCurrentStat(stats[index]);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] font-sans overflow-x-hidden min-h-screen relative selection:bg-blue-500/10">
      {/* Hiệu ứng trôi nổi và CSS đặc thù của bản thiết kế */}
      <style>{`
        .floating-animation {
          animation: floating 6s ease-in-out infinite;
        }
        @keyframes floating {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .cloud-drift {
          animation: drift 20s linear infinite;
        }
        @keyframes drift {
          from { transform: translateX(-10%); }
          to { transform: translateX(10%); }
        }
      `}</style>

      {/* 1. TopNavBar (Simplified cho trang 404) */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm h-20 flex items-center justify-between px-6 md:px-12 max-w-[1280px] mx-auto left-0 right-0">
        <div
          onClick={() => navigate("/dashboard")}
          className="text-2xl font-black text-[#0058be] tracking-tight cursor-pointer active:scale-95 transition-all"
        >
          REMN
        </div>
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex space-x-6">
            <Link
              className="text-sm font-semibold text-slate-500 hover:text-[#0058be] transition-colors"
              to="/map"
            >
              Bản đồ
            </Link>
            <Link
              className="text-sm font-semibold text-slate-500 hover:text-[#0058be] transition-colors"
              to="/ranking"
            >
              Xếp hạng
            </Link>
            <Link
              className="text-sm font-semibold text-slate-500 hover:text-[#0058be] transition-colors"
              to="/news"
            >
              Tin tức
            </Link>
          </nav>
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm cursor-pointer active:scale-95 transition-all hover:opacity-90"
          >
            BH
          </button>
        </div>
      </header>

      {/* 2. Main Content Canvas */}
      <main className="min-h-screen pt-20 flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-12">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0058be]/5 rounded-full blur-3xl cloud-drift"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#00687a]/10 rounded-full blur-3xl cloud-drift"
            style={{ animationDirection: "reverse" }}
          ></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-center gap-12">
          {/* Illustration Column */}
          <div className="w-full md:w-1/2 flex justify-center relative">
            <div className="relative w-72 h-72 md:w-96 md:h-96 floating-animation">
              {/* Giữ nguyên bức ảnh minh họa trạm cảm biến của Bảo */}
              <img
                alt="404 Air Station"
                className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe-i7o_KOULkxcgIi8ppGclgrKL1PE5_wAVD7yvYTennZKLGJkaXsa4t4pvYbsV2S3Dueq1GGZHzd-5SssBD3rq1DmAOlAX0L63i2-W3WoKB6H1N1OuzNYQYiW0rP1pweP55jf0ns3SeJ-068LVlih0W81VWALuppjjTg38fSQWRoEsercK2lQWDo82Qe0EibHOn-vKTlLse0k29zN1UEdl24x5VDAr5hWyjDmslHA8Dj6fxLGX5O-20BF5Z_vtBbZKZq7OEbOSpM"
              />
              {/* Khối kính mờ hiển thị trạng thái quét khí quyển */}
              <div className="absolute -top-4 -right-4 bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-lg flex items-center gap-2 border border-white/50">
                <span className="text-emerald-500 text-sm">🍃</span>
                <span className="text-xs font-bold text-slate-700">
                  AQI: {currentStat}
                </span>
              </div>
              <div className="absolute -bottom-6 -left-4 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50">
                <div className="flex gap-1">
                  <div className="w-1.5 h-6 bg-[#0058be]/20 rounded-full"></div>
                  <div className="w-1.5 h-4 bg-[#0058be]/10 rounded-full mt-2"></div>
                  <div className="w-1.5 h-8 bg-[#0058be]/30 rounded-full -mt-2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <div className="inline-block px-4 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-xs font-bold mb-4">
              LỖI KẾT NỐI KHÔNG KHÍ
            </div>
            <h1 className="text-3xl md:text-4xl text-slate-900 font-black tracking-tight mb-4 leading-tight">
              404 - Không tìm thấy bầu không khí này
            </h1>
            <p className="text-slate-500 text-sm md:text-base mb-6 max-w-lg leading-relaxed font-medium">
              Có vẻ như trang bạn đang tìm kiếm đã bị gió cuốn đi mất. Hãy quay
              lại trang chủ để tiếp tục theo dõi chất lượng không khí nhé.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto bg-[#0058be] text-white px-8 py-4 rounded-xl text-sm font-bold hover:shadow-[0_10px_30px_rgba(0,88,190,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Về trang chủ
              </button>
              <button
                onClick={() =>
                  alert("Đã ghi nhận báo cáo lỗi hệ thống phần cứng!")
                }
                className="w-full sm:w-auto border-2 border-slate-200 text-slate-600 px-8 py-4 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Báo cáo lỗi
              </button>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-6 justify-center md:justify-start text-xs text-slate-400 font-bold">
              <div className="flex items-center gap-1.5">
                <span>🛡️</span> Dữ liệu thời gian thực
              </div>
              <div className="flex items-center gap-1.5">
                <span>🔒</span> Bảo mật tuyệt đối
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="bg-white border-t border-slate-100 mt-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 px-6 md:px-12 py-10 max-w-[1280px] mx-auto">
          <div className="md:col-span-2">
            <div className="text-2xl font-black text-[#0058be] mb-3">REMN</div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs">
              Hệ thống giám sát chất lượng không khí thông minh cho đô thị hiện
              đại. Minh bạch thông tin, nâng cao sức khỏe cộng đồng.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Nền tảng</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li>
                <Link
                  to="/map"
                  className="hover:text-[#0058be] transition-colors"
                >
                  Bản đồ AQI
                </Link>
              </li>
              <li>
                <Link
                  to="/ranking"
                  className="hover:text-[#0058be] transition-colors"
                >
                  Xếp hạng vùng
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Hỗ trợ</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li>
                <Link to="#" className="hover:text-[#0058be] transition-colors">
                  Điều khoản
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-[#0058be] transition-colors"
                >
                  Trang cá nhân
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Hệ thống</h4>
            <div className="flex gap-2 text-[10px] font-extrabold bg-slate-50 px-3 py-1.5 border border-slate-100 rounded-lg text-slate-400 w-fit">
              <span>STATUS:</span>
              <span className="text-emerald-500">v2.4.0-stable</span>
            </div>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-5 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 font-bold">
          <span>© 2026 REMN AIR QUALITY. Bảo lưu mọi quyền.</span>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
