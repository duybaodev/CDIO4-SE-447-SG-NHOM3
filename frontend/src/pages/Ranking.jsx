import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Ranking = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Dữ liệu mô phỏng bảng xếp hạng AQI chuẩn quốc tế tại Việt Nam
  const fullData = [
    {
      rank: 1,
      city: "Đà Lạt",
      province: "Lâm Đồng",
      aqi: 15,
      pm25: "3.6 µg/m³",
      status: "Tuyệt vời",
      color: "#10B981",
      textColor: "text-emerald-500",
      bgClass: "bg-emerald-50/60 border-emerald-100",
    },
    {
      rank: 2,
      city: "Vũng Tàu",
      province: "Bà Rịa - Vũng Tàu",
      aqi: 24,
      pm25: "5.8 µg/m³",
      status: "Trong lành",
      color: "#10B981",
      textColor: "text-emerald-500",
      bgClass: "bg-emerald-50/60 border-emerald-100",
    },
    {
      rank: 3,
      city: "Đà Nẵng",
      province: "Thành phố Đà Nẵng",
      aqi: 32,
      pm25: "7.4 µg/m³",
      status: "Trong lành",
      color: "#10B981",
      textColor: "text-emerald-500",
      bgClass: "bg-emerald-50/60 border-emerald-100",
    },
    {
      rank: 4,
      city: "Nha Trang",
      province: "Khánh Hòa",
      aqi: 45,
      pm25: "9.2 µg/m³",
      status: "Trong lành",
      color: "#10B981",
      textColor: "text-emerald-500",
      bgClass: "bg-emerald-50/60 border-emerald-100",
    },
    {
      rank: 5,
      city: "Cần Thơ",
      province: "Thành phố Cần Thơ",
      aqi: 54,
      pm25: "13.5 µg/m³",
      status: "Trung bình",
      color: "#F59E0B",
      textColor: "text-amber-500",
      bgClass: "bg-amber-50/60 border-amber-100",
    },
    {
      rank: 6,
      city: "Thành phố Hồ Chí Minh",
      province: "TP. HCM",
      aqi: 88,
      pm25: "29.4 µg/m³",
      status: "Trung bình",
      color: "#F59E0B",
      textColor: "text-amber-500",
      bgClass: "bg-amber-50/60 border-amber-100",
    },
    {
      rank: 7,
      city: "Hà Nội",
      province: "Thủ đô Hà Nội",
      aqi: 142,
      pm25: "52.1 µg/m³",
      status: "Kém",
      color: "#F97316",
      textColor: "text-orange-500",
      bgClass: "bg-orange-50/60 border-orange-100",
    },
    {
      rank: 8,
      city: "Bắc Ninh",
      province: "Tỉnh Bắc Ninh",
      aqi: 155,
      pm25: "64.8 µg/m³",
      status: "Xấu",
      color: "#EF4444",
      textColor: "text-red-500",
      bgClass: "bg-red-50/60 border-red-100",
    },
  ];

  // Khối xử lý tìm kiếm và lọc tab thông minh
  const filteredData = fullData.filter((item) => {
    const matchesSearch =
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.province.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === "good") return item.aqi <= 50;
    if (filterType === "bad") return item.aqi > 50;
    return true;
  });

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] font-sans min-h-screen w-full flex flex-col overflow-x-hidden antialiased selection:bg-blue-500/10">
      {/* 1. Thanh TopNavBar chuẩn Kính mờ (Glassmorphism) */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 h-20 shadow-sm transition-all">
        <div className="flex items-center justify-between px-6 md:px-12 h-full max-w-[1400px] mx-auto">
          <div className="flex items-center gap-8">
            <Link
              to="/dashboard"
              className="text-3xl font-black text-blue-600 tracking-tighter active:scale-95 transition-transform"
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
                className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 py-1"
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
          <div>
            <button
              onClick={() => navigate("/")}
              className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-md active:scale-95"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Không gian bố cục Bento Main */}
      <main className="flex-grow pt-28 pb-16 px-4 md:px-12 max-w-[1400px] mx-auto w-full space-y-6">
        {/* KHỐI BENTO HEADER & ĐIỀU KHIỂN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Bento Thống kê nhanh trái */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] bg-blue-50 text-blue-600 font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Hệ thống thời gian thực
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
                Xếp Hạng Bầu Không Khí
              </h1>
              <p className="text-sm text-slate-400 mt-1.5">
                Bảng so sánh mật độ bụi mịn PM2.5 và chỉ số ô nhiễm trên toàn
                lãnh thổ quốc gia.
              </p>
            </div>

            {/* Bộ lọc Tab chuyển đổi nhanh */}
            <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200/40 w-fit mt-6 gap-1">
              {[
                ["all", "Tất cả cả nước"],
                ["good", "Trong lành (≤ 50)"],
                ["bad", "Ô nhiễm (> 50)"],
              ].map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    filterType === type
                      ? "bg-white text-blue-600 shadow-md shadow-slate-200/50"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Bento Ô tìm kiếm thông minh phải */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Bộ lọc tìm kiếm
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Gõ tên tỉnh hoặc thành phố để tra cứu
              </p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Ví dụ: Đà Nẵng, Hà Nội..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                🔍
              </div>
            </div>
          </div>
        </div>

        {/* KHỐI BENTO BẢNG BIỂU HIỆN ĐẠI (BENTO BOARD COMPONENT) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <th className="py-5 px-8 text-center w-24">Hạng</th>
                  <th className="py-5 px-6">Khu vực địa lý</th>
                  <th className="py-5 px-6 text-center w-40">Bụi mịn PM2.5</th>
                  <th className="py-5 px-6 text-center w-40">Chỉ số AQI</th>
                  <th className="py-5 px-8 text-center w-48">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-semibold">
                {filteredData.map((item) => (
                  <tr
                    key={item.rank}
                    className="hover:bg-slate-50/40 transition-colors group"
                  >
                    {/* Cột Thứ hạng cao cấp */}
                    <td className="py-5 px-8 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-black shadow-sm ${
                          item.rank === 1
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : item.rank === 2
                            ? "bg-slate-100 text-slate-600 border border-slate-200"
                            : item.rank === 3
                            ? "bg-orange-100 text-orange-700 border border-orange-200"
                            : "bg-slate-50 text-slate-400 border border-slate-100"
                        }`}
                      >
                        #{item.rank}
                      </span>
                    </td>

                    {/* Cột Tên Tỉnh thành dạng khối bento nhỏ */}
                    <td className="py-5 px-6">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
                          {item.city}
                        </p>
                        <p className="text-xs text-slate-400 font-normal">
                          {item.province}
                        </p>
                      </div>
                    </td>

                    {/* Cột thông số phụ PM2.5 */}
                    <td className="py-5 px-6 text-center text-slate-500 font-medium font-mono">
                      {item.pm25}
                    </td>

                    {/* Cột Chỉ số AQI thiết kế chữ siêu đậm nét */}
                    <td className="py-5 px-6 text-center">
                      <span
                        className="text-xl font-black font-mono tracking-tighter"
                        style={{ color: item.color }}
                      >
                        {item.aqi}
                      </span>
                    </td>

                    {/* Cột Badge Trạng thái viên thuốc bo tròn tinh tế */}
                    <td className="py-5 px-8 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${item.bgClass} ${item.textColor}`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State Layout khi không tìm thấy kết quả */}
          {filteredData.length === 0 && (
            <div className="p-16 text-center flex flex-col items-center justify-center space-y-3">
              <div className="text-3xl">🕵️‍♂️</div>
              <p className="text-base font-bold text-slate-500">
                Không tìm thấy thành phố bạn yêu cầu
              </p>
              <p className="text-xs text-slate-400 max-w-xs">
                Hãy thử kiểm tra lại chính tả hoặc tìm kiếm bằng các từ khóa
                chung chung như "Hà Nội" hay "Đà Nẵng".
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Ranking;
