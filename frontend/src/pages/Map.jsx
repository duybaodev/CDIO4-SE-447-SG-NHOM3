import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ------------------------------
// Component hỗ trợ di chuyển bản đồ mượt
// ------------------------------
const ChangeMapView = ({ center, zoom = 12 }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, map, zoom]);
  return null;
};

// ------------------------------
// Component chính
// ------------------------------
const Map = () => {
  const navigate = useNavigate();

  // State dữ liệu
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [mapCenter, setMapCenter] = useState([16.0544, 108.2022]); // Mặc định Đà Nẵng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho dropdown (giữ lại để tương thích giao diện)
  const [selectedCity, setSelectedCity] = useState("danang");

  // ------------------------------
  // Fetch dữ liệu từ API
  // ------------------------------
  useEffect(() => {
    fetch("http://localhost:5005/api/air-quality/map/locations")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải dữ liệu");
        return res.json();
      })
      .then((res) => {
        const data = res.data || res;
        if (Array.isArray(data) && data.length > 0) {
          setStations(data);
          setSelectedStation(data[0]);
          // Cập nhật tâm bản đồ theo trạm đầu tiên
          if (data[0].coordinates) {
            setMapCenter([data[0].coordinates.lat, data[0].coordinates.lng]);
          }
        } else {
          setError("Không có dữ liệu trạm đo.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi fetch bản đồ:", err);
        setError(err.message || "Lỗi kết nối đến máy chủ.");
        setLoading(false);
      });
  }, []);

  // ------------------------------
  // Xử lý chọn trạm (click marker hoặc sidebar)
  // ------------------------------
  const handleStationSelect = (station) => {
    setSelectedStation(station);
    if (station.coordinates) {
      setMapCenter([station.coordinates.lat, station.coordinates.lng]);
    }
  };

  // ------------------------------
  // Tạo icon marker (vòng tròn nhấp nháy theo AQI)
  // ------------------------------
  const createCustomIcon = (aqi) => {
    let color = "#22C55E"; // mặc định tốt
    if (aqi > 50 && aqi <= 100) color = "#EAB308"; // trung bình
    else if (aqi > 100) color = "#EF4444"; // xấu

    return L.divIcon({
      html: `
        <div style="position: relative; width: 20px; height: 20px;">
          <div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
          <div style="position: absolute; top: 0; left: 0; background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.6; z-index: -1;"></div>
        </div>
      `,
      className: "custom-marker-icon",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  // ------------------------------
  // Hiển thị loading / lỗi
  // ------------------------------
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#faf8ff]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 font-semibold">
            Đang tải dữ liệu bản đồ...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#faf8ff]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <p className="text-red-500 font-bold text-lg">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary-dark"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------
  // Render giao diện chính
  // ------------------------------
  return (
    <div className="bg-[#faf8ff] text-[#131b2e] font-sans h-screen w-full flex flex-col overflow-hidden relative">
      {/* CSS cho hiệu ứng ping */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      {/* ----- Top Navbar (giữ nguyên) ----- */}
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

      {/* ----- Nội dung chính ----- */}
      <div className="flex-grow flex w-full overflow-hidden relative">
        {/* Sidebar bên trái */}
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

            {/* Dropdown khu vực (giữ nguyên nhưng có thể điều hướng nếu muốn) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Khu vực quan sát
              </label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  const city = e.target.value;
                  setSelectedCity(city);
                  // Có thể set mapCenter theo thành phố nếu có tọa độ định sẵn
                  const cityCoords = {
                    danang: [16.0544, 108.2022],
                    hanoi: [21.0285, 105.8542],
                    hcm: [10.8231, 106.6297],
                  };
                  if (cityCoords[city]) {
                    setMapCenter(cityCoords[city]);
                    // Lọc stations theo thành phố? (nếu API hỗ trợ) – tạm thời không lọc
                  }
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-primary transition-all appearance-none"
              >
                <option value="danang">Đà Nẵng (Vị trí hiện tại)</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
              </select>
            </div>

            {/* Danh sách trạm từ API */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Danh sách trạm đo
              </label>
              <div className="space-y-2">
                {stations.map((station) => (
                  <div
                    key={station._id}
                    onClick={() => handleStationSelect(station)}
                    className={`p-3.5 border rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      selectedStation?._id === station._id
                        ? "bg-slate-900 border-slate-900 text-white shadow-md scale-[1.02]"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          selectedStation?._id === station._id
                            ? "text-white"
                            : "text-slate-800"
                        }`}
                      >
                        {station.name}
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          selectedStation?._id === station._id
                            ? "text-slate-300"
                            : "text-slate-400"
                        }`}
                      >
                        Tọa độ: {station.coordinates?.lat?.toFixed(4)},{" "}
                        {station.coordinates?.lng?.toFixed(4)}
                      </p>
                    </div>
                    <div
                      className="px-3 py-1 rounded-lg text-white font-black text-sm shadow-sm"
                      style={{
                        backgroundColor:
                          station.aqi <= 50
                            ? "#22C55E"
                            : station.aqi <= 100
                            ? "#EAB308"
                            : "#EF4444",
                      }}
                    >
                      {station.aqi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Bản đồ */}
        <section className="flex-grow h-full relative z-0">
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ width: "100%", height: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Component tự động căn giữa */}
            <ChangeMapView center={mapCenter} />

            {/* Các marker */}
            {stations.map((station) =>
              station.coordinates ? (
                <Marker
                  key={station._id}
                  position={[station.coordinates.lat, station.coordinates.lng]}
                  icon={createCustomIcon(station.aqi)}
                  eventHandlers={{ click: () => handleStationSelect(station) }}
                >
                  <Popup>
                    <div className="font-sans p-1 text-slate-800">
                      <h4 className="font-bold text-sm mb-1">{station.name}</h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded text-white"
                          style={{
                            backgroundColor:
                              station.aqi <= 50
                                ? "#22C55E"
                                : station.aqi <= 100
                                ? "#EAB308"
                                : "#EF4444",
                          }}
                        >
                          AQI {station.aqi}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {station.aqi <= 50
                            ? "Tốt"
                            : station.aqi <= 100
                            ? "Trung bình"
                            : "Kém"}
                        </span>
                      </div>
                      {station.weather && (
                        <p className="text-xs text-slate-500 mt-1">
                          Nhiệt độ: {station.weather.temp}°C
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>

          {/* Thang đo màu (giữ nguyên) */}
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/50 shadow-xl max-w-[240px] w-full space-y-2 z-[1000]">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Ngưỡng chỉ số
            </h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-[10px] bg-[#22C55E] rounded"></div>
                <span className="text-[11px] font-medium text-slate-600">
                  0 - 50: Tốt
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-[10px] bg-[#EAB308] rounded"></div>
                <span className="text-[11px] font-medium text-slate-600">
                  51 - 100: Trung bình
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-[10px] bg-[#EF4444] rounded"></div>
                <span className="text-[11px] font-medium text-slate-600">
                  &gt; 100: Kém
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
