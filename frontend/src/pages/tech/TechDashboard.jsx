import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const TechDashboard = () => {
  const navigate = useNavigate();

  // Dữ liệu giả lập giám sát trạng thái hệ thống phần cứng IoT toàn quốc
  const systemStatus = {
    totalStations: 42,
    onlineStations: 38,
    maintenanceRequired: 4,
    batteryAlerts: 2,
  };

  // Danh sách các trạm cảm biến đang gặp sự cố cần kỹ thuật viên xử lý khẩn cấp
  const criticalStations = [
    {
      id: "ST-009",
      name: "Trạm KCN Hòa Khánh",
      region: "Liên Chiểu, Đà Nẵng",
      issue: "Hỏng cảm biến PM2.5",
      battery: "12%",
      signal: "Yếu (-85 dBm)",
      status: "Critical",
      time: "10 phút trước",
    },
    {
      id: "ST-014",
      name: "Trạm Hoàn Kiếm B",
      region: "Hoàn Kiếm, Hà Nội",
      issue: "Mất kết nối hoàn toàn",
      battery: "Unknown",
      signal: "No Signal",
      status: "Offline",
      time: "32 phút trước",
    },
    {
      id: "ST-022",
      name: "Trạm Chợ Bến Thành",
      region: "Quận 1, TP. HCM",
      issue: "Lỗi hiệu chuẩn O3 & CO",
      battery: "68%",
      signal: "Tốt (-52 dBm)",
      status: "Warning",
      time: "2 giờ trước",
    },
    {
      id: "ST-003",
      name: "Trạm Đèo Prenn",
      region: "Đà Lạt, Lâm Đồng",
      issue: "Pin sụt giảm đột ngột",
      battery: "5%",
      signal: "Trung bình (-70 dBm)",
      status: "Critical",
      time: "5 giờ trước",
    },
  ];

  return (
    <div className="bg-[#0f172a] text-[#f8fafc] font-sans min-h-screen w-full flex flex-col antialiased selection:bg-blue-500/20">
      {/* 1. THANH TOPNAVBAR CHO PHÂN HỆ KỸ THUẬT VIÊN (DARK THEME) */}
      <nav className="fixed top-0 w-full z-50 bg-[#1e293b]/80 backdrop-blur-xl border-b border-slate-800 h-20 shadow-lg">
        <div className="flex items-center justify-between px-6 md:px-12 h-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <Link
              to="/tech/dashboard"
              className="text-3xl font-black text-blue-500 tracking-tighter hover:opacity-90 transition-opacity"
            >
              REMN{" "}
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded ml-1 tracking-normal font-bold">
                TECH
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8 ml-4">
              <Link
                to="/tech/dashboard"
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Hệ thống trạm đo
              </Link>
              <Link
                to="/tech/devices"
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Quản lý thiết bị
              </Link>
              <Link
                to="/tech/logs"
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Nhật ký bảo trì
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/50 px-4 py-2 rounded-xl">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-slate-300">
                KTV: Lê Hoài Bảo
              </span>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 hover:text-white px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 shadow-md"
            >
              Thoát hệ thống
            </button>
          </div>
        </div>
      </nav>

      {/* 2. KHÔNG GIAN BENTO GRID TRUNG TÂM ĐIỀU HÀNH */}
      <main className="flex-grow pt-28 pb-16 px-4 md:px-12 max-w-[1440px] mx-auto w-full space-y-6">
        {/* HEADER VÀ TRẠNG THÁI YÊU CẦU */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Bảng Điều Khiển Phần Cứng
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Hệ thống giám sát tình trạng sống/chết của các trạm cảm biến toàn
              quốc.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-2xl text-xs font-bold">
            <span>🔥</span> Có {systemStatus.maintenanceRequired} trạm cần xử lý
            khẩn cấp hôm nay
          </div>
        </div>

        {/* LƯỚI BENTO 1: SỐ LIỆU THỐNG KÊ THỜI GIAN THỰC (METRICS RECTANGLE) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              label: "Tổng trạm cảm biến",
              val: systemStatus.totalStations,
              color: "text-blue-400",
              bg: "bg-blue-500/5 border-blue-500/10",
            },
            {
              label: "Trạm đang hoạt động",
              val: systemStatus.onlineStations,
              color: "text-emerald-400",
              bg: "bg-emerald-500/5 border-emerald-500/10",
              suffix: "✓ Online",
            },
            {
              label: "Yêu cầu bảo trì",
              val: systemStatus.maintenanceRequired,
              color: "text-red-400",
              bg: "bg-red-500/5 border-red-500/10",
              suffix: "⚠ Khẩn cấp",
            },
            {
              label: "Cảnh báo pin yếu (<15%)",
              val: systemStatus.batteryAlerts,
              color: "text-amber-400",
              bg: "bg-amber-500/5 border-amber-500/10",
              suffix: "🪫 Thay pin",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-[#1e293b] p-6 rounded-3xl border ${stat.bg} shadow-md flex flex-col justify-between space-y-4`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>
              <div className="flex items-baseline justify-between w-full">
                <span
                  className={`text-4xl font-black font-mono tracking-tighter ${stat.color}`}
                >
                  {stat.val}
                </span>
                {stat.suffix && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 ${stat.color}`}
                  >
                    {stat.suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* LƯỚI BENTO 2: DANH SÁCH PHIẾU SỰ CỐ KHẨN CẤP (TICKET BOARD) */}
        <div className="bg-[#1e293b] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1e293b]/50">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">
                Sự Cố Thiết Bị Thời Gian Thực
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Danh sách các phần cứng IoT bị crash, hỏng cảm biến hoặc sụt
                nguồn điện.
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 self-start sm:self-center">
              🔄 Làm mới dữ liệu trạm
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#151f32]/60 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <th className="py-4 px-6">Mã Trạm</th>
                  <th className="py-4 px-6">Tên Vị Trí / Khu Vực</th>
                  <th className="py-4 px-6 text-center">Nội Dung Sự Cố</th>
                  <th className="py-4 px-6 text-center">Nguồn Điện</th>
                  <th className="py-4 px-6 text-center">Tín Hiệu Sóng</th>
                  <th className="py-4 px-8 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm font-medium">
                {criticalStations.map((station) => (
                  <tr
                    key={station.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    {/* Mã trạm dạng code tag */}
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-blue-400 font-bold">
                        {station.id}
                      </span>
                    </td>

                    {/* Tên trạm địa lý */}
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-white group-hover:text-blue-400 transition-colors">
                          {station.name}
                        </p>
                        <p className="text-xs text-slate-500 font-normal mt-0.5">
                          {station.region}
                        </p>
                      </div>
                    </td>

                    {/* Nội dung báo hỏng */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          station.status === "Offline"
                            ? "bg-slate-500/10 text-slate-400"
                            : station.status === "Critical"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        ✕ {station.issue}
                      </span>
                    </td>

                    {/* % Pin trạm */}
                    <td className="py-4 px-6 text-center font-mono text-xs">
                      <span
                        className={
                          station.battery === "5%" || station.battery === "12%"
                            ? "text-red-400 font-bold animate-pulse"
                            : "text-slate-400"
                        }
                      >
                        {station.battery}
                      </span>
                    </td>

                    {/* Cường độ tín hiệu dBm */}
                    <td className="py-4 px-6 text-center font-mono text-xs text-slate-400">
                      {station.signal}
                    </td>

                    {/* Nút hành động xử lý khẩn cấp */}
                    <td className="py-4 px-8 text-center">
                      <button className="bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 border border-slate-700 hover:border-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95">
                        Xử lý ngay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer nhỏ của bảng báo cáo */}
          <div className="p-4 bg-[#151f32]/40 text-center text-xs text-slate-500 border-t border-slate-800 font-medium">
            Hệ thống tự động quét chu kỳ quét cảm biến: 30 giây / lần
          </div>
        </div>
      </main>
    </div>
  );
};

export default TechDashboard;
