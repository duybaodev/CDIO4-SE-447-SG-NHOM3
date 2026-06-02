import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Nạp các linh kiện bản đồ thật từ thư viện
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Map = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("danang");

  // Mảng dữ liệu tọa độ thực tế (Vĩ độ - Kinh độ) các trạm đo tại Đà Nẵng
  const stations = [
    {
      id: 1,
      name: "Trạm Hải Châu (Trung tâm)",
      lat: 16.0678,
      lng: 108.2208,
      aqi: 32,
      status: "Tốt",
      color: "#22C55E",
    },
    {
      id: 2,
      name: "Trạm Ngũ Hành Sơn",
      lat: 16.0335,
      lng: 108.2515,
      aqi: 28,
      status: "Tốt",
      color: "#22C55E",
    },
    {
      id: 3,
      name: "Trạm KCN Hòa Khánh",
      lat: 16.0712,
      lng: 108.1495,
      aqi: 56,
      status: "Trung bình",
      color: "#EAB308",
    },
    {
      id: 4,
      name: "Trạm Liên Chiểu",
      lat: 16.0945,
      lng: 108.1652,
      aqi: 42,
      status: "Tốt",
      color: "#22C55E",
    },
  ];

  // Tọa độ trung tâm để camera bản đồ tập trung vào Đà Nẵng
  const daNangCenter = [16.0544, 108.2022];

  // Hàm tự tạo Icon hình tròn nhấp nháy bằng CSS, không lo bị lỗi thiếu file ảnh png
  const createCustomIcon = (color) => {
    return new L.divIcon({
      html: `<div style="position: relative; width: 16px; height: 16px;">
               <div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
               <div style="position: absolute; top: 0; left: 0; background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.6; z-index: -1;"></div>
             </div>`,
      className: "custom-marker-icon",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] font-sans h-screen w-full flex flex-col overflow-hidden relative">
      {/* Thêm hiệu ứng Ping động cho icon bằng style nội bộ */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      {/* 1. Thanh TopNavBar đồng bộ hệ thống */}
      <nav className="w-full z-50 bg-white border-b border-slate-100 shadow-sm h-20 flex-shrink-0">
        <div className="flex items-center justify-between px-6 md:px-10 h-full max-w-[1280px] mx-auto">
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-3xl font-black text-primary tracking-tight cursor-pointer active:scale-95 transition-all"
            >
              REMN
            </Link>
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <Link
                to="/dashboard"
                className="text-sm text-slate-500 hover:text-primary transition-colors"
              >
                Tổng quan
              </Link>
              <Link
                to="/map"
                className="text-sm text-primary font-bold border-b-2 border-primary py-1"
              >
                Bản đồ
              </Link>
              <Link
                to="/ranking"
                className="text-sm text-slate-500 hover:text-primary transition-colors"
              >
                Xếp hạng
              </Link>
              <Link
                to="/news"
                className="text-sm text-slate-500 hover:text-primary transition-colors"
              >
                Tin tức
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Khu vực nội dung chính */}
      <div className="flex-grow flex w-full overflow-hidden relative">
        {/* SIDEBAR BÊN TRÁI: Danh sách thông số các trạm */}
        <aside className="w-full md:w-[380px] bg-white border-r border-slate-100 p-6 flex flex-col justify-between flex-shrink-0 z-10 h-full overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Bản đồ Hệ thống
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Dữ liệu địa lý thực tế tương tác trực quan
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Khu vực quan sát
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-primary transition-all appearance-none"
              >
                <option value="danang">Đà Nẵng (Vị trí hiện tại)</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Danh sách trạm đo thật
              </label>
              <div className="space-y-2">
                {stations.map((station) => (
                  <div
                    key={station.id}
                    className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {station.name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Tọa độ: {station.lat}, {station.lng}
                      </p>
                    </div>
                    <div
                      className="px-3 py-1 rounded-lg text-white font-black text-sm shadow-sm"
                      style={{ backgroundColor: station.color }}
                    >
                      {station.aqi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* VÙNG CHỨA BẢN ĐỒ THẬT SỰ */}
        <section className="flex-grow h-full relative z-0">
          <MapContainer
            center={daNangCenter}
            zoom={12}
            style={{ width: "100%", height: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {stations.map((station) => (
              <Marker
                key={station.id}
                position={[station.lat, station.lng]}
                icon={createCustomIcon(station.color)} // Gọi hàm sinh icon CSS không sợ lỗi file ảnh
              >
                <Popup>
                  <div className="font-sans p-1 text-slate-800">
                    <h4 className="font-bold text-sm mb-1">{station.name}</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: station.color }}
                      >
                        AQI {station.aqi}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        Chất lượng: {station.status}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Thang đo dải màu cố định ở góc phải */}
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 shadow-xl max-w-[240px] w-full space-y-2 z-[1000]">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Ngưỡng chỉ số
            </h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-2.5 bg-[#22C55E] rounded"></div>
                <span className="text-[11px] font-medium text-slate-600">
                  0 - 50: Tốt
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2.5 bg-[#EAB308] rounded"></div>
                <span className="text-[11px] font-medium text-slate-600">
                  51 - 100: Trung bình
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Map;
