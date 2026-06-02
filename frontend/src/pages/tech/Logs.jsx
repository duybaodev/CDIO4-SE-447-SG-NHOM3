import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Logs = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");

  // Dữ liệu mô phỏng lịch sử nhật ký bảo trì hệ thống trạm cảm biến REMN
  const maintenanceLogs = [
    {
      id: "LOG-9921",
      stationId: "ST-009",
      engineer: "Lê Hoài Bảo",
      action: "Thay mới cụm cảm biến quang học PM2.5",
      date: "01/06/2026",
      cost: "1.200.000 đ",
      status: "Success",
      type: "Thay thế",
    },
    {
      id: "LOG-9874",
      stationId: "ST-003",
      engineer: "Nguyễn Tuấn Kiệt",
      action: "Thay cell Pin Li-Po 10.000mAh & bo sạc Solar",
      date: "29/05/2026",
      cost: "850.000 đ",
      status: "Success",
      type: "Sửa chữa",
    },
    {
      id: "LOG-9851",
      stationId: "ST-022",
      engineer: "Nguyễn Hồng Quân",
      action: "Hiệu chuẩn buồng đốt khí CO và bộ thu sóng 4G",
      date: "25/05/2026",
      cost: "300.000 đ",
      status: "Success",
      type: "Hiệu chuẩn",
    },
    {
      id: "LOG-9710",
      stationId: "ST-014",
      engineer: "Lê Hoài Bảo",
      action: "Kiểm tra lỗi mất nguồn (Chờ linh kiện thay thế)",
      date: "20/05/2026",
      cost: "0 đ",
      status: "Pending",
      type: "Kiểm tra",
    },
  ];

  // Logic lọc nhật ký theo trạng thái
  const filteredLogs = maintenanceLogs.filter((log) => {
    if (statusFilter === "all") return true;
    return log.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="bg-[#0f172a] text-[#f8fafc] font-sans min-h-screen w-full flex flex-col antialiased selection:bg-blue-500/20">
      {/* 1. Thanh TopNavBar đồng bộ Dark Theme của Tech */}
      <nav className="fixed top-0 w-full z-50 bg-[#1e293b]/80 backdrop-blur-xl border-b border-slate-800 h-20 shadow-lg">
        <div className="flex items-center justify-between px-6 md:px-12 h-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <Link
              to="/tech/dashboard"
              className="text-3xl font-black text-blue-500 tracking-tighter"
            >
              REMN{" "}
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded ml-1 font-bold">
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
                className="text-sm font-bold text-blue-400 border-b-2 border-blue-400 py-1"
              >
                Nhật ký bảo trì
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/50 px-4 py-2 rounded-xl">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-bold text-slate-300">
                KTV: Lê Hoài Bảo
              </span>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
            >
              Thoát
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Không gian bố cục Bento Lịch sử công tác */}
      <main className="flex-grow pt-28 pb-16 px-4 md:px-12 max-w-[1440px] mx-auto w-full space-y-6">
        {/* Khối Bento Tiêu đề & Bộ lọc Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
              Hồ sơ vận hành
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight mt-2">
              Nhật Ký Sửa Chữa & Bảo Trì
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Lưu trữ minh bạch lịch sử can thiệp, chi phí vật tư và nhân sự
              chịu trách nhiệm kỹ thuật.
            </p>
          </div>

          {/* Tabs Filter nhanh */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit self-start lg:self-center gap-1">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Tất cả phiếu
            </button>
            <button
              onClick={() => setStatusFilter("success")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                statusFilter === "success"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Đã hoàn thành
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                statusFilter === "pending"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Đang xử lý
            </button>
          </div>
        </div>

        {/* Khung Bento bảng dữ liệu nhật ký sửa chữa */}
        <div className="bg-[#1e293b] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#151f32]/60 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <th className="py-4 px-6">Mã Phiếu</th>
                  <th className="py-4 px-6">Mã Trạm</th>
                  <th className="py-4 px-6">Nội Dung Can Thiệp Phần Cứng</th>
                  <th className="py-4 px-6 text-center">Kỹ Thuật Viên</th>
                  <th className="py-4 px-6 text-center">Ngày Sửa</th>
                  <th className="py-4 px-6 text-center">Chi Phí Linh Kiện</th>
                  <th className="py-4 px-8 text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm font-medium">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">
                      {log.id}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-blue-400 font-bold">
                      {log.stationId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white">{log.action}</p>
                        <p className="text-xs text-slate-500 font-normal">
                          Phân loại: {log.type}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-xs font-bold text-slate-400">
                      {log.engineer}
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-xs text-slate-500">
                      {log.date}
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-xs text-slate-300">
                      {log.cost}
                    </td>
                    <td className="py-4 px-8 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          log.status === "Success"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                        }`}
                      >
                        {log.status === "Success"
                          ? "✓ Thành công"
                          : "⏳ Chờ xử lý"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Logs;
