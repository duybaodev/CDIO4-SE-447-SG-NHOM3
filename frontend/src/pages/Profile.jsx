import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  // State quản lý thông tin cấu hình thông báo
  const [settings, setSettings] = useState({
    emailAlert: true,
    smsAlert: false,
    weeklyReport: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] font-sans min-h-screen w-full flex flex-col antialiased selection:bg-blue-500/10">
      {/* 1. Thanh TopNavBar Glassmorphism đồng bộ */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 h-20 shadow-sm">
        <div className="flex items-center justify-between px-6 md:px-12 h-full max-w-[1400px] mx-auto">
          <div className="flex items-center gap-8">
            <Link
              to="/dashboard"
              className="text-3xl font-black text-blue-600 tracking-tighter"
            >
              REMN
            </Link>
            <div className="hidden md:flex items-center space-x-8 ml-4">
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                Tổng quan
              </Link>
              <Link
                to="/map"
                className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                Bản đồ
              </Link>
              <Link
                to="/ranking"
                className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                Xếp hạng
              </Link>
              <Link
                to="/news"
                className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                Tin tức
              </Link>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-md active:scale-95"
          >
            Đăng xuất
          </button>
        </div>
      </nav>

      {/* 2. Không gian bố cục Bento Profile */}
      <main className="flex-grow pt-28 pb-16 px-4 md:px-12 max-w-[1000px] mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Tài Khoản & Cài Đặt
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý thông tin hồ sơ cá nhân và cấu hình nhận cảnh báo ô nhiễm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Thẻ Bento 1: Hồ sơ cá nhân (Trái) */}
          <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-md shadow-blue-200">
              BH
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-800">
                Lê Hoài Bảo
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Thành viên Phân hệ User
              </p>
            </div>
            <div className="w-full pt-4 border-t border-slate-100 text-left space-y-2">
              <div className="text-xs">
                <span className="font-bold text-slate-500">Vai trò:</span> Người
                dùng phổ thông
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-500">Khu vực:</span> Đà
                Nẵng, Việt Nam
              </div>
            </div>
          </div>

          {/* Thẻ Bento 2: Cấu hình hệ thống thông báo (Phải) */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Cấu hình nhận cảnh báo AQI
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Hệ thống AI sẽ tự động gửi thông báo khi môi trường xung quanh
                có biến động xấu.
              </p>
            </div>

            <div className="space-y-4 divide-y divide-slate-50">
              {/* Toggle Email */}
              <div className="flex items-center justify-between pt-4 first:pt-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-800">
                    Thông báo qua Email
                  </p>
                  <p className="text-xs text-slate-400">
                    Nhận bản tin cảnh báo bụi mịn PM2.5 khi vượt ngưỡng an toàn.
                  </p>
                </div>
                <button
                  onClick={() => toggleSetting("emailAlert")}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                    settings.emailAlert
                      ? "bg-blue-600 flex justify-end"
                      : "bg-slate-200 flex justify-start"
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-sm"></span>
                </button>
              </div>

              {/* Toggle SMS */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-800">
                    Cảnh báo SMS khẩn cấp
                  </p>
                  <p className="text-xs text-slate-400">
                    Gửi tin nhắn trực tiếp đến số điện thoại khi chất lượng
                    không khí đạt mức Xấu (#EF4444).
                  </p>
                </div>
                <button
                  onClick={() => toggleSetting("smsAlert")}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                    settings.smsAlert
                      ? "bg-blue-600 flex justify-end"
                      : "bg-slate-200 flex justify-start"
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-sm"></span>
                </button>
              </div>

              {/* Toggle Báo cáo tuần */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-800">
                    Báo cáo phân tích tuần
                  </p>
                  <p className="text-xs text-slate-400">
                    Tổng hợp biểu đồ xu hướng 24h và dự báo AI môi trường vào
                    mỗi sáng thứ Hai.
                  </p>
                </div>
                <button
                  onClick={() => toggleSetting("weeklyReport")}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                    settings.weeklyReport
                      ? "bg-blue-600 flex justify-end"
                      : "bg-slate-200 flex justify-start"
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-sm"></span>
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md active:scale-95">
                Lưu cấu hình cài đặt
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
