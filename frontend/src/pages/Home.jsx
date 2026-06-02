import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // State quản lý vùng miền được lựa chọn hoạt động
  const [activeRegion, setActiveRegion] = useState("center"); // north: Bắc, center: Trung, south: Nam

  // Kho dữ liệu đồng bộ theo từng vùng miền
  const regionData = {
    north: {
      cityName: "Hà Nội, Việt Nam",
      aqi: 142,
      statusText: "Chất lượng kém",
      colorClass: "text-[#F97316]",
      badgeClass: "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20",
      pm25: "52.1 µg/m³",
      temp: "29°C",
      humidity: "78%",
      uv: "4.2 Trung bình",
      mapImg:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=60",
      chartPath:
        "M0,150 Q100,120 200,90 T400,60 T600,110 T800,50 L800,200 L0,200 Z",
      chartStroke: "M0,150 Q100,120 200,90 T400,60 T600,110 T800,50",
      circleY: 60,
      alertMessage:
        "⚠️ Cảnh báo: Nồng độ bụi mịn PM2.5 tại miền Bắc đang tăng cao. Nhóm người nhạy cảm, trẻ em nên hạn chế các hoạt động thể thao ngoài trời kéo dài.",
    },
    center: {
      cityName: "Đà Nẵng, Việt Nam",
      aqi: 32,
      statusText: "Chất lượng tốt",
      colorClass: "text-[#22C55E]",
      badgeClass: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
      pm25: "7.4 µg/m³",
      temp: "27°C",
      humidity: "65%",
      uv: "6.5 Cao",
      mapImg:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format&fit=crop&q=60",
      chartPath:
        "M0,180 Q100,160 200,130 T400,90 T600,140 T800,110 L800,200 L0,200 Z",
      chartStroke: "M0,180 Q100,160 200,130 T400,90 T600,140 T800,110",
      circleY: 90,
      alertMessage:
        "🍃 Môi trường lý tưởng: Khí quyển miền Trung đang rất trong lành. Thích hợp mở các cửa sổ để thông gió tự nhiên và tập thể dục nâng cao sức khỏe.",
    },
    south: {
      cityName: "TP. Hồ Chí Minh, Việt Nam",
      aqi: 88,
      statusText: "Trung bình",
      colorClass: "text-[#EAB308]",
      badgeClass: "bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20",
      pm25: "29.4 µg/m³",
      temp: "33°C",
      humidity: "70%",
      uv: "9.2 Rất cao",
      mapImg:
        "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=600&auto=format&fit=crop&q=60",
      chartPath:
        "M0,160 Q100,140 200,110 T400,120 T600,90 T800,130 L800,200 L0,200 Z",
      chartStroke: "M0,160 Q100,140 200,110 T400,120 T600,90 T800,130",
      circleY: 120,
      alertMessage:
        "😷 Lưu ý: Chỉ số ô nhiễm tầng mặt tại miền Nam ở mức báo động nhẹ vào khung giờ cao điểm. Hãy trang bị khẩu trang y tế tiêu chuẩn khi tham gia giao thông.",
    },
  };

  const current = regionData[activeRegion];

  // 1. Giữ nguyên hiệu ứng chạy số tự động (Counter Animation) từ code gốc
  useEffect(() => {
    const animateCounter = (id, start, end, duration) => {
      let obj = document.getElementById(id);
      if (!obj) return;
      let currentVal = start;
      let range = end - start;
      let increment = end > start ? 1 : -1;
      let stepTime = Math.abs(Math.floor(duration / range));
      if (stepTime === 0) stepTime = 1;

      let timer = setInterval(function () {
        currentVal += increment;
        if (id === "count-accuracy") {
          obj.innerText = (currentVal / 10).toFixed(1) + "%";
        } else if (id === "count-users") {
          obj.innerText = (currentVal / 10).toFixed(1) + "M+";
        } else {
          obj.innerText = currentVal.toLocaleString();
        }
        if (currentVal === end) {
          clearInterval(timer);
        }
      }, stepTime);
    };

    const timeoutId = setTimeout(() => {
      animateCounter("count-users", 0, 25, 1500);
      animateCounter("count-stations", 0, 1240, 1500);
      animateCounter("count-accuracy", 0, 999, 1500);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  // 2. Giữ nguyên hiệu ứng mạch đập chỉ số AQI (Pulse Effect) từ code gốc
  useEffect(() => {
    const aqiDisplay = document.getElementById("main-aqi");
    if (!aqiDisplay) return;

    const intervalId = setInterval(() => {
      aqiDisplay.style.transition = "transform 0.5s ease-in-out";
      aqiDisplay.style.transform = "scale(1.05)";
      setTimeout(() => {
        aqiDisplay.style.transform = "scale(1)";
      }, 500);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [activeRegion]);

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] font-sans overflow-x-hidden min-h-screen relative selection:bg-blue-500/10">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm h-20">
        <div className="flex items-center justify-between px-6 md:px-10 h-full max-w-[1280px] mx-auto">
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-3xl font-black text-blue-600 tracking-tight cursor-pointer active:scale-95 transition-all"
            >
              REMN
            </Link>
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <Link
                to="/dashboard"
                className="text-sm text-blue-600 font-bold border-b-2 border-blue-600 py-1"
              >
                Tổng quan
              </Link>
              <Link
                to="/map"
                className="text-sm text-slate-500 hover:text-primary font-semibold transition-colors py-1"
              >
                Bản đồ
              </Link>
              <Link
                to="/ranking"
                className="text-sm text-slate-500 hover:text-primary font-semibold transition-colors py-1"
              >
                Xếp hạng
              </Link>
              <Link
                to="/news"
                className="text-sm text-slate-500 hover:text-primary font-semibold transition-colors py-1"
              >
                Tin tức
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-slate-50 rounded-full px-4 py-1.5 border border-slate-200 focus-within:border-primary transition-all">
              <span className="text-slate-400 mr-2">🔍</span>
              <input
                className="bg-transparent border-none outline-none text-sm w-48"
                placeholder="Tìm kiếm thành phố..."
                type="text"
              />
            </div>

            <Link
              to="/profile"
              className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm cursor-pointer active:scale-95 transition-all hover:opacity-90"
              title="Xem trang cá nhân của Bảo"
            >
              BH
            </Link>

            <button
              onClick={() => navigate("/")}
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* THANH CẢNH BÁO MÔI TRƯỜNG TOÀN QUỐC */}
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 mt-6">
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3 animate-fade-in">
            <span className="flex-shrink-0 text-lg">📢</span>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              {current.alertMessage}
            </p>
          </div>
        </div>

        {/* KHỐI CHỌN NHANH VÙNG MIỀN */}
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 mt-6 flex justify-center">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 shadow-inner gap-1">
            <button
              onClick={() => setActiveRegion("north")}
              className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all ${
                activeRegion === "north"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ⚡ Miền Bắc
            </button>
            <button
              onClick={() => setActiveRegion("center")}
              className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all ${
                activeRegion === "center"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🌊 Miền Trung
            </button>
            <button
              onClick={() => setActiveRegion("south")}
              className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all ${
                activeRegion === "south"
                  ? "bg-white text-amber-500 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🌴 Miền Nam
            </button>
          </div>
        </div>

        {/* 🌟 NÂNG CẤP: THANG ĐO AQI CHUẨN QUỐC TẾ BENTO STYLE 🌟 */}
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 mt-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span>🎨</span> Quy chuẩn dải màu cảnh báo AQI US
              </h3>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                EPA Standard
              </span>
            </div>

            {/* Thanh đo thiết kế Grid chia khối cực sang */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                {
                  range: "0 - 50",
                  status: "Tốt",
                  color: "bg-[#22C55E]",
                  glow: "shadow-[#22C55E]/10",
                  desc: "Không có nguy cơ",
                  active: current.aqi <= 50,
                },
                {
                  range: "51 - 100",
                  status: "Trung bình",
                  color: "bg-[#EAB308]",
                  glow: "shadow-[#EAB308]/10",
                  desc: "Nhạy cảm lưu ý",
                  active: current.aqi > 50 && current.aqi <= 100,
                },
                {
                  range: "101 - 150",
                  status: "Kém",
                  color: "bg-[#F97316]",
                  glow: "shadow-[#F97316]/10",
                  desc: "Giảm ra ngoài",
                  active: current.aqi > 100 && current.aqi <= 150,
                },
                {
                  range: "151 - 200",
                  status: "Xấu",
                  color: "bg-[#EF4444]",
                  glow: "shadow-[#EF4444]/10",
                  desc: "Hại sức khỏe",
                  active: current.aqi > 150 && current.aqi <= 200,
                },
                {
                  range: "201 - 300",
                  status: "Rất xấu",
                  color: "bg-[#A855F7]",
                  glow: "shadow-[#A855F7]/10",
                  desc: "Cảnh báo khẩn cấp",
                  active: current.aqi > 200 && current.aqi <= 300,
                },
                {
                  range: "301+",
                  status: "Nguy hại",
                  color: "bg-[#7F1D1D]",
                  glow: "shadow-[#7F1D1D]/10",
                  desc: "Sơ tán toàn bộ",
                  active: current.aqi > 300,
                },
              ].map((scale, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 relative ${
                    scale.active
                      ? `bg-white border-slate-900 shadow-lg ring-2 ring-slate-900/5 ${scale.glow} scale-[1.02]`
                      : "bg-slate-50/50 border-slate-100 opacity-60 hover:opacity-90"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-400 font-mono">
                      {scale.range}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${scale.color} ${
                        scale.active ? "animate-pulse" : ""
                      }`}
                    ></span>
                  </div>
                  <p className="font-extrabold text-sm text-slate-800 mt-2">
                    {scale.status}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">
                    {scale.desc}
                  </p>

                  {/* Mũi tên nhỏ định vị nếu dải màu đó trùng khớp chỉ số hiện tại */}
                  {scale.active && (
                    <span className="absolute -top-1 right-3 bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                      Hiện tại
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Section - Hiển thị dữ liệu động dựa theo miền đã chọn */}
        <section className="relative min-h-[440px] flex flex-col items-center justify-center py-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent -z-10"></div>

          <div className="text-center px-4">
            <p className="text-lg text-slate-500 font-extrabold mb-2 tracking-tight">
              {current.cityName}
            </p>
            <h1
              className={`text-8xl font-black mb-3 select-none tracking-tighter transition-all duration-500 ${current.colorClass}`}
              id="main-aqi"
            >
              {current.aqi}
            </h1>
            <div
              className={`inline-flex items-center px-5 py-1.5 rounded-full border ${current.badgeClass}`}
            >
              <span className="mr-2">📊</span>
              <span className="text-xs font-black uppercase tracking-widest">
                {current.statusText}
              </span>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto w-full">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center transition-transform hover:-translate-y-1">
                <span className="text-xl block mb-1">💨</span>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  PM2.5
                </p>
                <p className="text-lg font-black text-slate-800 mt-1">
                  {current.pm25}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center transition-transform hover:-translate-y-1">
                <span className="text-xl block mb-1">🌡️</span>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Nhiệt độ
                </p>
                <p className="text-lg font-black text-slate-800 mt-1">
                  {current.temp}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center transition-transform hover:-translate-y-1">
                <span className="text-xl block mb-1">💧</span>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Độ ẩm
                </p>
                <p className="text-lg font-black text-slate-800 mt-1">
                  {current.humidity}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center transition-transform hover:-translate-y-1">
                <span className="text-xl block mb-1">☀️</span>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Chỉ số UV
                </p>
                <p className="text-lg font-black text-slate-800 mt-1">
                  {current.uv}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area: Bento Grid Layout */}
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
          {/* Left Column: Chart & Forecast */}
          <div className="lg:col-span-8 space-y-6">
            {/* AQI Charts */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-[380px] flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <span>📈</span> Xu hướng biến động 24h
                </h3>
                <div className="flex gap-2 text-xs font-bold">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                    AQI US
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full">
                    PM2.5
                  </span>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="w-full relative pt-4">
                <svg
                  className="w-full h-44"
                  viewBox="0 0 800 200"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#2563EB"
                        stopOpacity="0.2"
                      ></stop>
                      <stop
                        offset="100%"
                        stopColor="#2563EB"
                        stopOpacity="0"
                      ></stop>
                    </linearGradient>
                  </defs>
                  <path
                    d={current.chartPath}
                    fill="url(#chartGradient)"
                    className="transition-all duration-700 ease-in-out"
                  ></path>
                  <path
                    d={current.chartStroke}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-in-out"
                  ></path>
                  <g
                    transform={`translate(400, ${current.circleY})`}
                    className="transition-all duration-700 ease-in-out"
                  >
                    <circle
                      fill="#2563EB"
                      r="6"
                      stroke="#fff"
                      strokeWidth="2"
                    ></circle>
                  </g>
                </svg>
                <div className="flex justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 font-medium">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>Hiện tại</span>
                </div>
              </div>
            </div>

            {/* Weather Forecast */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <span>📅</span> Dự báo xu hướng chu kỳ tới
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center py-2 border-b border-slate-50">
                  <p className="text-sm font-semibold text-slate-700">
                    Hôm nay
                  </p>
                  <span className="text-center">⛅</span>
                  <div className="flex items-center gap-2 justify-self-center text-xs font-bold">
                    <span className="text-slate-400">18°</span>
                    <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                      <div className="absolute left-1/4 right-1/4 h-full bg-gradient-to-r from-blue-400 to-yellow-400"></div>
                    </div>
                    <span className="text-slate-700">26°</span>
                  </div>
                  <p className="font-black text-sm justify-self-end text-blue-600">
                    Ổn định
                  </p>
                </div>
                <div className="grid grid-cols-4 items-center py-2 border-b border-slate-50">
                  <p className="text-sm font-semibold text-slate-700">
                    Ngày mai
                  </p>
                  <span className="text-center">☀️</span>
                  <div className="flex items-center gap-2 justify-self-center text-xs font-bold">
                    <span className="text-slate-400">20°</span>
                    <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                      <div className="absolute left-1/3 right-1/5 h-full bg-gradient-to-r from-yellow-400 to-orange-400"></div>
                    </div>
                    <span className="text-slate-700">30°</span>
                  </div>
                  <p className="font-black text-sm justify-self-end text-blue-600">
                    Ổn định
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Map Link & Cities */}
          <div className="lg:col-span-4 space-y-6">
            <Link
              to="/map"
              className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group cursor-pointer relative h-64"
            >
              <img
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                alt="Bản đồ trạm đo vệ tinh"
                src={current.mapImg}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-5">
                <h3 className="text-white font-bold text-lg">
                  Hệ thống trạm IoT thực tế
                </h3>
                <p className="text-white/80 text-xs font-medium">
                  Bấm để chuyển sang Map tương tác ➔
                </p>
              </div>
            </Link>

            {/* Featured Cities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-4">
                Mật độ khu vực tiêu biểu
              </h3>
              <div className="space-y-3">
                <div
                  onClick={() => setActiveRegion("south")}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#EAB308]/10 rounded-full flex items-center justify-center text-[#EAB308] font-black text-sm">
                      88
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        TP. Hồ Chí Minh
                      </p>
                      <p className="text-slate-400 text-xs">
                        Miền Nam • Trung bình
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs">➔</span>
                </div>
                <div
                  onClick={() => setActiveRegion("center")}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#22C55E]/10 rounded-full flex items-center justify-center text-[#22C55E] font-black text-sm">
                      32
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Đà Nẵng
                      </p>
                      <p className="text-slate-400 text-xs">
                        Miền Trung • Trong lành
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs">➔</span>
                </div>
                <div
                  onClick={() => setActiveRegion("north")}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F97316]/10 rounded-full flex items-center justify-center text-[#F97316] font-black text-sm">
                      142
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Hà Nội</p>
                      <p className="text-slate-400 text-xs">
                        Miền Bắc • Không tốt
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs">➔</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Animated Counters Section */}
        <section className="bg-slate-50 py-12 border-y border-slate-100">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4
                  className="text-4xl font-black text-blue-600 mb-1.5"
                  id="count-users"
                >
                  0.0M+
                </h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Người dùng tin tưởng
                </p>
              </div>
              <div className="text-center border-y md:border-y-0 md:border-x border-slate-200 py-6 md:py-0">
                <h4
                  className="text-4xl font-black text-blue-600 mb-1.5"
                  id="count-stations"
                >
                  0
                </h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Trạm quan trắc
                </p>
              </div>
              <div className="text-center">
                <h4
                  className="text-4xl font-black text-blue-600 mb-1.5"
                  id="count-accuracy"
                >
                  0.0%
                </h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Độ chính xác dữ liệu
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 relative w-full mt-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 px-6 md:px-10 py-12 max-w-[1280px] mx-auto">
          <div className="md:col-span-2">
            <span className="text-3xl font-black text-blue-600 block mb-3">
              REMN
            </span>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Cung cấp thông tin chất lượng không khí thời gian thực với độ
              chính xác cao nhất, giúp bạn bảo vệ sức khỏe cộng đồng.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-sm text-slate-800 mb-3">Dịch vụ</h5>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li className="hover:text-primary transition-transform hover:translate-x-1 cursor-pointer">
                Bản đồ thời gian thực
              </li>
              <li className="hover:text-primary transition-transform hover:translate-x-1 cursor-pointer">
                Phân tích chuyên sâu
              </li>
              <li className="hover:text-primary transition-transform hover:translate-x-1 cursor-pointer">
                Cảnh báo thông minh
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm text-slate-800 mb-3">Hỗ trợ</h5>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li className="hover:text-primary transition-transform hover:translate-x-1 cursor-pointer">
                Về chúng tôi
              </li>
              <li className="hover:text-primary transition-transform hover:translate-x-1 cursor-pointer">
                API Dữ liệu
              </li>
              <li className="hover:text-primary transition-transform hover:translate-x-1 cursor-pointer">
                Liên hệ
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm text-slate-800 mb-3">Pháp lý</h5>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li className="hover:text-primary transition-transform hover:translate-x-1 cursor-pointer">
                Điều khoản
              </li>
              <li className="hover:text-primary transition-transform hover:translate-x-1 cursor-pointer">
                Bảo mật
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-5 border-t border-slate-50 text-center text-xs text-slate-400 font-medium">
          © 2026 REMN AIR QUALITY. Bảo lưu mọi quyền.
        </div>
      </footer>
    </div>
  );
};

export default Home;
