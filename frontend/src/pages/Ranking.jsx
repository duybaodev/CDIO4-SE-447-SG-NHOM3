import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Ranking = () => {
  const navigate = useNavigate();

  // State dữ liệu
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State bộ lọc
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // ----------------------------------------------
  // 1. Fetch dữ liệu từ API và sắp xếp
  // ----------------------------------------------
  useEffect(() => {
    fetch("http://localhost:5005/api/air-quality/map/locations")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải dữ liệu");
        return res.json();
      })
      .then((res) => {
        const data = res.data || res;
        if (Array.isArray(data) && data.length > 0) {
          // Sắp xếp AQI tăng dần (thành phố trong lành nhất đứng đầu)
          const sorted = data.sort((a, b) => a.aqi - b.aqi);
          setRawData(sorted);
          setFilteredData(sorted);
        } else {
          setError("Không có dữ liệu trạm đo.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi fetch dữ liệu xếp hạng:", err);
        setError(err.message || "Lỗi kết nối đến máy chủ.");
        setLoading(false);
      });
  }, []);

  // ----------------------------------------------
  // 2. Xử lý lọc theo tab + tìm kiếm
  // ----------------------------------------------
  useEffect(() => {
    let result = [...rawData];

    // Lọc theo tab
    if (filterType === "good") {
      result = result.filter((item) => item.aqi <= 50);
    } else if (filterType === "bad") {
      result = result.filter((item) => item.aqi > 50);
    }

    // Lọc theo từ khóa tìm kiếm (tên trạm)
    if (searchTerm.trim() !== "") {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(result);
  }, [filterType, searchTerm, rawData]);

  // ----------------------------------------------
  // 3. Hàm tiện ích xác định trạng thái, màu sắc
  // ----------------------------------------------
  const getStatusMeta = (aqi) => {
    if (aqi <= 50) {
      return {
        status: "Tuyệt vời",
        color: "#10B981",
        textColor: "text-emerald-500",
        bgClass: "bg-emerald-50/60 border-emerald-100",
      };
    } else if (aqi <= 100) {
      return {
        status: "Trung bình",
        color: "#F59E0B",
        textColor: "text-amber-500",
        bgClass: "bg-amber-50/60 border-amber-100",
      };
    } else {
      return {
        status: "Kém",
        color: "#EF4444",
        textColor: "text-red-500",
        bgClass: "bg-red-50/60 border-red-100",
      };
    }
  };

  // ----------------------------------------------
  // 4. Render trạng thái loading / lỗi
  // ----------------------------------------------
  if (loading) {
    return (
      <div className="bg-[#f8fafc] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 font-semibold">
            Đang tải dữ liệu xếp hạng...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#f8fafc] min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <p className="text-red-500 font-bold text-lg">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------
  // 5. Render giao diện chính (giữ nguyên từ bản gốc)
  // ----------------------------------------------
  return (
    <div className="bg-[#f8fafc] text-[#0f172a] font-sans min-h-screen w-full flex flex-col overflow-x-hidden antialiased selection:bg-blue-500/10">
      {/* ----- Navbar (giữ nguyên) ----- */}
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

      {/* ----- Main content (giữ nguyên cấu trúc Bento) ----- */}
      <main className="flex-grow pt-28 pb-16 px-4 md:px-12 max-w-[1400px] mx-auto w-full space-y-6">
        {/* Bento Header + Bộ lọc */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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

        {/* Bảng xếp hạng */}
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
                {filteredData.map((item, index) => {
                  const meta = getStatusMeta(item.aqi);
                  // Lấy PM2.5 nếu có, nếu không thì ước lượng từ AQI
                  const pm25 = item.pm25
                    ? item.pm25
                    : `${Math.round(item.aqi * 0.28)} µg/m³`;
                  // Lấy tên tỉnh/thành phố
                  const cityName = item.name || "Không xác định";
                  const province = item.region
                    ? item.region === "Bac"
                      ? "Miền Bắc"
                      : item.region === "Trung"
                      ? "Miền Trung"
                      : "Miền Nam"
                    : "Việt Nam";

                  return (
                    <tr
                      key={item._id || index}
                      className="hover:bg-slate-50/40 transition-colors group"
                    >
                      {/* Hạng */}
                      <td className="py-5 px-8 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-black shadow-sm ${
                            index === 0
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : index === 1
                              ? "bg-slate-100 text-slate-600 border border-slate-200"
                              : index === 2
                              ? "bg-orange-100 text-orange-700 border border-orange-200"
                              : "bg-slate-50 text-slate-400 border border-slate-100"
                          }`}
                        >
                          #{index + 1}
                        </span>
                      </td>

                      {/* Tên thành phố + khu vực */}
                      <td className="py-5 px-6">
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
                            {cityName}
                          </p>
                          <p className="text-xs text-slate-400 font-normal">
                            {province}
                          </p>
                        </div>
                      </td>

                      {/* PM2.5 */}
                      <td className="py-5 px-6 text-center text-slate-500 font-medium font-mono">
                        {pm25}
                      </td>

                      {/* AQI */}
                      <td className="py-5 px-6 text-center">
                        <span
                          className="text-xl font-black font-mono tracking-tighter"
                          style={{ color: meta.color }}
                        >
                          {item.aqi}
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-5 px-8 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${meta.bgClass} ${meta.textColor}`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: meta.color }}
                          ></span>
                          {meta.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
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
