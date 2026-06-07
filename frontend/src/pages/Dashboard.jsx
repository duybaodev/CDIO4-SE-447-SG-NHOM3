import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [animatedAQI, setAnimatedAQI] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  // --- 1. Gọi API lấy danh sách các trạm đo ---
  const fetchMapData = async (region) => {
    try {
      let url = "http://localhost:5005/api/air-quality/map/locations";
      if (region) url += `?region=${region}`;
      const res = await fetch(url);
      const result = await res.json();
      if (result.success && result.data.length > 0) {
        setLocations(result.data);
        if (!selectedLoc) setSelectedLoc(result.data[0]);
      }
    } catch (error) {
      console.error("Lỗi kết nối API trạm đo:", error);
    }
  };

  useEffect(() => {
    fetchMapData(regionFilter);
  }, [regionFilter]);

  // --- 2. Hiệu ứng đếm số AQI mượt mà ---
  useEffect(() => {
    if (selectedLoc?.aqi) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 500);
      let start = animatedAQI,
        end = selectedLoc.aqi,
        duration = 500;
      let stepTime = Math.abs(Math.floor(duration / (end - start || 1)));
      let current = start;
      let interval = setInterval(() => {
        if (current < end) current += Math.ceil((end - start) / 20);
        else if (current > end) current -= Math.ceil((start - end) / 20);
        else {
          clearInterval(interval);
          return;
        }
        if (current > end) current = end;
        if (current < end) current = end;
        setAnimatedAQI(current);
      }, stepTime);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [selectedLoc?.aqi]);

  // --- 3. Xử lý tìm kiếm thành phố ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword) return;
    try {
      const res = await fetch(
        `http://localhost:5005/api/air-quality/search?keyword=${searchKeyword}`
      );
      const result = await res.json();
      if (result.success) {
        setSelectedLoc(result.data);
        setAiAdvice("");
      } else alert(result.message);
    } catch (error) {
      alert("Không tìm thấy khu vực tương ứng!");
    }
  };

  // --- 4. 🔥 HÀM AI ĐÃ ĐƯỢC ĐỊNH NGHĨA CHUẨN XÁC, SỬA LỖI ĐỌC HEADER SẠCH ---
  const handleAskAI = async () => {
    if (!selectedLoc) return;
    setLoadingAI(true);
    setAiAdvice("");

    try {
      // 🎯 SỬA TẠI ĐÂY: Thử lấy REMN_USER_TOKEN, nếu không có thì lấy thử "token" hoặc "accessToken"
      const token =
        localStorage.getItem("REMN_USER_TOKEN") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      const headersConfig = { "Content-Type": "application/json" };

      if (token && token.trim() !== "") {
        headersConfig["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(
        "http://localhost:5005/api/air-quality/weather/ai-analyze",
        {
          method: "POST",
          headers: headersConfig,
          body: JSON.stringify({ locationId: selectedLoc._id }),
        }
      );

      const result = await res.json();

      if (res.status === 401 || res.status === 403) {
        alert(
          `🔒 TÍNH NĂNG BẢO MẬT REMN:\n${
            result.message ||
            "Phiên đăng nhập hết hạn hoặc không hợp lệ, vui lòng đăng nhập lại!"
          }`
        );
        setLoadingAI(false);
        return;
      }

      if (result.success) {
        setAiAdvice(result.aiAdvice);
      } else {
        alert(result.message || "Không thể lấy dữ liệu phân tích từ AI.");
      }
    } catch (error) {
      console.error("Lỗi gọi AI:", error);
      alert("⚠️ Cổng kết nối dịch vụ AI đang gặp sự cố.");
    }
    setLoadingAI(false);
  };
  // --- 5. Cấu hình màu sắc, trạng thái hiển thị ---
  const getAQIStatus = (aqi) => {
    if (!aqi)
      return {
        text: "KHÔNG DỮ LIỆU",
        color: "text-slate-500",
        bg: "bg-slate-100",
        border: "border-slate-200",
        gradient: "from-slate-400 to-slate-500",
        icon: "📊",
        description: "Đang cập nhật dữ liệu",
      };
    if (aqi <= 50)
      return {
        text: "TỐT",
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        gradient: "from-emerald-400 to-teal-500",
        icon: "🌿",
        description: "Lý tưởng cho mọi hoạt động ngoài trời",
      };
    if (aqi <= 100)
      return {
        text: "TRUNG BÌNH",
        color: "text-amber-500",
        bg: "bg-amber-50",
        border: "border-amber-200",
        gradient: "from-amber-400 to-yellow-500",
        icon: "⚠️",
        description: "Nhóm nhạy cảm nên hạn chế hoạt động kéo dài",
      };
    if (aqi <= 150)
      return {
        text: "KÉM",
        color: "text-orange-500",
        bg: "bg-orange-50",
        border: "border-orange-200",
        gradient: "from-orange-400 to-red-500",
        icon: "😷",
        description: "Hạn chế ra ngoài, đeo khẩu trang khi cần thiết",
      };
    if (aqi <= 200)
      return {
        text: "XẤU",
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-200",
        gradient: "from-red-500 to-rose-600",
        icon: "🚨",
        description: "Nguy hại cho sức khỏe, tránh hoạt động ngoài trời",
      };
    return {
      text: "NGUY HẠI",
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      gradient: "from-purple-600 to-pink-600",
      icon: "💀",
      description: "Cảnh báo khẩn cấp, ở trong nhà và đóng cửa",
    };
  };

  const aqiInfo = getAQIStatus(selectedLoc?.aqi);
  const topFiveRanking = [...locations]
    .sort((a, b) => b.aqi - a.aqi)
    .slice(0, 5);
  const pollutionPercentage = selectedLoc?.aqi
    ? Math.min(100, (selectedLoc.aqi / 300) * 100)
    : 0;

  const getPMMessage = (pm25) => {
    if (!pm25) return "Đang cập nhật";
    if (pm25 <= 12) return "An toàn";
    if (pm25 <= 35) return "Chấp nhận được";
    if (pm25 <= 55) return "Không lành mạnh cho nhóm nhạy cảm";
    if (pm25 <= 150) return "Không lành mạnh";
    return "Rất có hại";
  };

  const kpiData = [
    {
      label: "Chỉ số khí quyển AQI",
      value: selectedLoc?.aqi || "--",
      unit: "",
      color: aqiInfo.color,
      icon: "🌍",
      desc: `Trạm: ${selectedLoc?.name?.slice(0, 20) || "Chưa chọn"}`,
    },
    {
      label: "Nhiệt độ hiện tại",
      value: selectedLoc?.weather?.temp ?? "--",
      unit: "°C",
      color: "text-orange-500",
      icon: "🌡️",
      desc: selectedLoc?.weather?.status || "--",
    },
    {
      label: "Độ ẩm tương đối",
      value: selectedLoc?.weather?.humidity ?? "--",
      unit: "%",
      color: "text-blue-500",
      icon: "💧",
      desc: `Vùng ${selectedLoc?.region || "--"}`,
    },
    {
      label: "Tốc độ gió",
      value: selectedLoc?.weather?.windSpeed ?? "--",
      unit: "km/h",
      color: "text-teal-500",
      icon: "💨",
      desc: "Cập nhật realtime",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 min-h-screen font-sans text-slate-800 selection:bg-blue-500 selection:text-white overflow-x-hidden">
      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ping-slow { 0% { transform: scale(0.8); opacity: 0.2; } 100% { transform: scale(1.5); opacity: 0; } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .animate-ping-slow { animation: ping-slow 0.8s cubic-bezier(0, 0, 0.2, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      {/* NAVBAR ĐIỀU HƯỚNG */}
      <header className="bg-white/80 backdrop-blur-md px-4 md:px-14 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg border-b border-slate-200/50 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-wider cursor-pointer"
          >
            REMN
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-semibold">
            <Link
              to="/dashboard"
              className="text-blue-600 border-b-2 border-blue-600 pb-1"
            >
              Tổng quan
            </Link>
            <Link
              to="/map"
              className="text-slate-500 hover:text-blue-600 transition-all"
            >
              Bản đồ
            </Link>
            <Link
              to="/ranking"
              className="text-slate-500 hover:text-blue-600 transition-all"
            >
              Xếp hạng
            </Link>
            <Link
              to="/news"
              className="text-slate-500 hover:text-blue-600 transition-all"
            >
              Tin tức
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <form
            onSubmit={handleSearch}
            className="flex bg-slate-100 px-4 py-2 rounded-full border border-slate-200 w-full md:w-auto"
          >
            <input
              type="text"
              placeholder="Tìm kiếm thành phố..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="border-none bg-transparent outline-none text-xs w-full md:w-44 text-slate-700"
            />
            <button
              type="submit"
              className="text-xs font-bold text-blue-600 ml-2"
            >
              🔍
            </button>
          </form>
          <Link
            to="/profile"
            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-md"
          >
            LH
          </Link>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-full transition-all"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="px-4 md:px-14 py-8 max-w-[1600px] mx-auto">
        {/* KPI DASHBOARD */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {kpiData.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-slate-100 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.label.split(" ")[0]}
                </span>
              </div>
              <span className={`text-3xl font-black mt-1 ${item.color}`}>
                {item.value}
                {item.unit}
              </span>
              <p className="text-[10px] text-slate-400 mt-2 truncate">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="flex flex-col gap-6">
            {/* Bản đồ Windy Nhúng Chuẩn */}
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-slate-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  🗺️ Bản đồ vị trí trạm quan trắc
                </h3>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-none text-slate-600"
                >
                  <option value="">🌏 Toàn quốc Việt Nam</option>
                  <option value="Bac">⛰️ Miền Bắc</option>
                  <option value="Trung">🏖️ Miền Trung</option>
                  <option value="Nam">🌴 Miền Nam</option>
                  <option value="BienDao">🏝️ Biển Đảo Việt Nam</option>
                </select>
              </div>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50 border border-slate-200">
                <iframe
                  title="Windy Dynamic Map"
                  src={`https://embed.windy.com/embed2.html?lat=${
                    selectedLoc?.coordinates?.lat || 16.0544
                  }&lon=${
                    selectedLoc?.coordinates?.lng || 108.2022
                  }&zoom=6&level=surface&overlay=cosc&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
                  className="absolute inset-0 w-full h-full border-none z-0"
                ></iframe>
              </div>
            </div>

            {/* Thang đo ô nhiễm */}
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                📊 Thang đo ô nhiễm không khí
              </h4>
              <div className="relative h-8 bg-gradient-to-r from-emerald-400 via-yellow-400 via-orange-400 to-red-600 rounded-full overflow-hidden shadow-inner mb-3">
                <div
                  className="absolute inset-y-0 w-1 bg-white shadow-lg rounded-full"
                  style={{ left: `${pollutionPercentage}%` }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs font-black bg-slate-800 text-white px-2 py-0.5 rounded-full shadow-lg">
                      {selectedLoc?.aqi || "?"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-bold mb-4">
                <span className="text-emerald-600">Tốt</span>
                <span className="text-amber-600">TB</span>
                <span className="text-orange-600">Kém</span>
                <span className="text-red-600">Xấu</span>
                <span className="text-purple-600">Nguy hại</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-600">
                    Bụi mịn PM2.5
                  </span>
                  <span className="text-lg font-black text-blue-600">
                    {selectedLoc?.pm25 || "--"} µg/m³
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        ((selectedLoc?.pm25 || 0) / 200) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Hệ thống trạm đo */}
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                🛰️ Hệ thống trạm đo môi trường
              </h4>
              <div className="flex flex-wrap gap-2.5 max-h-40 overflow-y-auto custom-scrollbar">
                {locations.map((loc) => (
                  <button
                    key={loc._id}
                    onClick={() => {
                      setSelectedLoc(loc);
                      setAiAdvice("");
                      if (loc.region === "BienDao")
                        alert(
                          `🇻🇳 KHẲNG ĐỊNH CHỦ QUYỀN THIÊNG LIÊNG:\n${loc.name} hoàn toàn thuộc về chủ quyền của Việt Nam!`
                        );
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      selectedLoc?._id === loc._id
                        ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white border-slate-900 shadow-lg scale-105"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {loc.name}
                    <span
                      className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                        loc.aqi > 100
                          ? "bg-rose-100 text-rose-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {loc.aqi}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bảng xếp hạng Top 5 */}
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                🏆 Bảng xếp hạng chất lượng môi trường toàn quốc (Top 5)
              </h4>
              <div className="divide-y divide-slate-100">
                {topFiveRanking.map((item, index) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black ${
                          index === 0
                            ? "bg-amber-500 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        AQI:
                      </span>
                      <span
                        className={`text-sm font-extrabold ${
                          item.aqi > 100 ? "text-rose-500" : "text-emerald-500"
                        }`}
                      >
                        {item.aqi}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Khối AQI lớn */}
            <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl shadow-lg border border-slate-100 text-center relative overflow-hidden">
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full ${
                  showPulse ? "animate-ping-slow" : ""
                } opacity-20 bg-blue-500`}
              ></div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {aqiInfo.icon} Trạm đang theo dõi
              </div>
              <div className="text-lg font-bold text-slate-800 mt-1">
                {selectedLoc?.name || "--"}, Việt Nam
              </div>
              <div
                className={`text-7xl font-black tracking-tighter my-4 font-mono transition-all duration-300 ${aqiInfo.color}`}
              >
                {animatedAQI || selectedLoc?.aqi || "--"}
              </div>
              <div
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide ${aqiInfo.bg} ${aqiInfo.color} border ${aqiInfo.border}`}
              >
                {aqiInfo.text}
              </div>
            </div>

            {/* AI Assistant Box */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl shadow-lg border border-blue-100">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-2xl animate-bounce">🤖</span>
                <h4 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-wide">
                  Trợ lý Phân tích Khí tượng Cao cấp (Gemini AI)
                </h4>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Hệ thống phân tích dữ liệu khí quyển real-time của trạm{" "}
                <b className="text-blue-600">{selectedLoc?.name}</b> để đưa ra
                cảnh báo sức khỏe và lời khuyên.
              </p>
              <button
                onClick={handleAskAI}
                disabled={loadingAI}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loadingAI ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xử lý thuật toán đám mây...
                  </>
                ) : (
                  "✨ Kích hoạt Trí tuệ Nhân tạo Phân tích"
                )}
              </button>
              {aiAdvice && (
                <div className="mt-4 p-4 bg-white border border-blue-200 rounded-xl text-xs text-slate-600 leading-relaxed shadow-inner animate-fade-in-up">
                  {aiAdvice}
                </div>
              )}
            </div>

            {/* Biểu đồ xu hướng */}
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                📈 Biến động chỉ số khí quyển theo chu kỳ 24h
              </h4>
              <div className="w-full h-44 bg-gradient-to-br from-slate-50 to-white p-2 rounded-xl border border-slate-100">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedLoc?.weather?.hourlyForecast || []}>
                    <defs>
                      <linearGradient
                        id="colorTemp"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="colorAQI" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip />
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <Area
                      type="monotone"
                      dataKey="temp"
                      name="Nhiệt độ"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorTemp)"
                    />
                    <Area
                      type="monotone"
                      dataKey="aqi"
                      name="Chỉ số AQI"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#colorAQI)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dự báo thời tiết ngày */}
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                📅 Xu hướng dự báo chu kỳ tới
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {(selectedLoc?.weather?.dailyForecast || []).map((d, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-slate-50 to-white p-3 rounded-xl text-center border border-slate-100"
                  >
                    <div className="text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {d.day}
                    </div>
                    <div className="text-xl my-2">
                      {d.status === "Mưa"
                        ? "🌧️"
                        : d.status === "Mây"
                        ? "☁️"
                        : "☀️"}
                    </div>
                    <div className="text-[11px] font-black text-amber-600">
                      {d.tempMin}° - {d.tempMax}°
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
