import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const STATIONS_URL = "http://localhost:5005/api/air-quality/map/locations";
const INCIDENTS_URL = "http://localhost:5005/api/sync/admin/incidents";
const CALIBRATE_URL = "http://localhost:5005/api/sync/tech/calibrate";

const normalizeCriticalStation = (inc) => ({
  id: inc.locationId?._id || "unknown",
  incidentId: inc._id,
  name: inc.locationId?.name || "Trạm khí tượng REMN",
  region:
    inc.locationId?.region === "Trung"
      ? "Liên Chiểu, Đà Nẵng"
      : inc.locationId?.region === "Bac"
      ? "Hoàn Kiếm, Hà Nội"
      : "Quận 1, TP. HCM",
  issue: inc.issueDescription,
  battery: inc.status === "Pending" ? "12%" : "68%",
  signal: inc.status === "Pending" ? "Yếu (-85 dBm)" : "Tốt (-52 dBm)",
  status: inc.status === "Pending" ? "Critical" : "Warning",
  time: "Thời gian thực",
});

const TechDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [systemStatus, setSystemStatus] = useState({
    totalStations: 0,
    onlineStations: 0,
    maintenanceRequired: 0,
    batteryAlerts: 0,
  });
  const [criticalStations, setCriticalStations] = useState([]);

  const [selectedStation, setSelectedStation] = useState(null);
  const [calibrateForm, setCalibrateForm] = useState({
    cpuUsage: 12,
    ramUsage: 42,
    sensorStatus: "Ổn định",
    isFixed: true,
  });

  const fetchTechDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [stationRes, incidentRes] = await Promise.all([
        fetch(STATIONS_URL),
        fetch(INCIDENTS_URL),
      ]);
      const stationResult = await stationRes.json();
      const incidentResult = await incidentRes.json();
      const rawStations = stationResult.data || stationResult;

      if (incidentResult.success && Array.isArray(rawStations)) {
        const mappedCritical = incidentResult.data
          .filter((inc) => inc.status !== "Resolved")
          .map(normalizeCriticalStation);

        setCriticalStations(mappedCritical);
        setSystemStatus({
          totalStations: rawStations.length,
          onlineStations: rawStations.filter((s) => s.status === "Active")
            .length,
          maintenanceRequired: mappedCritical.length,
          batteryAlerts: rawStations.filter((s) => s.status === "Disabled")
            .length,
        });
      }
    } catch (err) {
      console.error("Lỗi liên kết dữ liệu Dashboard Kỹ sư:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTechDashboardData();
  }, [fetchTechDashboardData]);

  const handleCalibrateSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selectedStation) return;

      try {
        const res = await fetch(`${CALIBRATE_URL}/${selectedStation.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cpuUsage: Number(calibrateForm.cpuUsage),
            ramUsage: Number(calibrateForm.ramUsage),
            sensorStatus: calibrateForm.sensorStatus,
            isFixed: calibrateForm.isFixed,
          }),
        });

        const result = await res.json();
        if (result.success) {
          alert(
            `🎉 Hiệu chuẩn thành công! Trạm đo đã được đồng bộ trạng thái Active (Màu xanh) về bản đồ chính của User.`
          );
          setSelectedStation(null);
          await fetchTechDashboardData();
        }
      } catch (err) {
        alert("Lỗi bắn lệnh hiệu chuẩn thiết bị lên server!");
      }
    },
    [calibrateForm, fetchTechDashboardData, selectedStation]
  );

  const stats = useMemo(
    () => [
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
        label: "Cảnh báo trạm dừng hỏng",
        val: systemStatus.batteryAlerts,
        color: "text-amber-400",
        bg: "bg-amber-500/5 border-amber-500/10",
        suffix: "🪫 Offline",
      },
    ],
    [systemStatus]
  );

  return (
    <div className="bg-[#0f172a] text-[#f8fafc] font-sans min-h-screen w-full flex flex-col antialiased selection:bg-blue-500/20">
      {/* 1. THANH TOPNAVBAR */}
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
                className="text-sm font-bold text-blue-400 border-b-2 border-blue-400 py-1"
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
              className="bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
            >
              Thoát
            </button>
          </div>
        </div>
      </nav>

      {/* 2. KHÔNG GIAN BENTO GRID TRUNG TÂM ĐIỀU HÀNH */}
      <main className="flex-grow pt-28 pb-16 px-4 md:px-12 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Bảng Điều Khiển Phân Cứng
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Hệ thống giám sát tình trạng sống/chết của các trạm cảm biến toàn
              quốc kết nối thời gian thực.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-2xl text-xs font-bold">
            <span>🔥</span> Có {systemStatus.maintenanceRequired} trạm cần xử lý
            khẩn cấp hôm nay
          </div>
        </div>

        {/* LƯỚI BENTO 1: METRICS */}
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
              label: "Cảnh báo trạm dừng hỏng",
              val: systemStatus.batteryAlerts,
              color: "text-amber-400",
              bg: "bg-amber-500/5 border-amber-500/10",
              suffix: "🪫 Offline",
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
                <span className="text-4xl font-black font-mono tracking-tighter text-white">
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

        {/* LƯỚI BENTO 2: PHIẾU SỰ CỐ */}
        <div className="bg-[#1e293b] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1e293b]/50">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">
                Sự Cố Thiết Bị Thời Gian Thực
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Danh sách các phần cứng IoT do Admin phân công cho Bảo.
              </p>
            </div>
            <button
              onClick={fetchTechDashboardData}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md active:scale-95"
            >
              🔄 Làm mới dữ liệu trạm
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#151f32]/60 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <th className="py-4 px-6">Mã Trạm</th>
                  <th className="py-4 px-6">Tên Vị Trí</th>
                  <th className="py-4 px-6 text-center">Nội Dung Sự Cố</th>
                  <th className="py-4 px-6 text-center">Nguồn Điện</th>
                  <th className="py-4 px-6 text-center">Tín Hiệu Sóng</th>
                  <th className="py-4 px-8 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm font-medium">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-slate-500">
                      Đang quét tiến độ chỉ huy từ Admin...
                    </td>
                  </tr>
                ) : criticalStations.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-8 text-emerald-400 font-bold text-xs"
                    >
                      🎉 Hệ thống REMN an toàn. Không có trạm hỏng hóc.
                    </td>
                  </tr>
                ) : (
                  criticalStations.map((station) => (
                    <tr
                      key={station.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono text-[10px] bg-slate-800 px-2.5 py-1 rounded-md border text-blue-400 font-bold truncate max-w-[80px] inline-block">
                          {station.id}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-white group-hover:text-blue-400">
                            {station.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {station.region}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            station.status === "Critical"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          ✕ {station.issue}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-mono text-xs text-red-400 font-bold animate-pulse">
                        {station.battery}
                      </td>
                      <td className="py-4 px-6 text-center font-mono text-xs text-slate-400">
                        {station.signal}
                      </td>
                      <td className="py-4 px-8 text-center">
                        <button
                          onClick={() => setSelectedStation(station)}
                          className="bg-slate-800 hover:bg-blue-600 hover:text-white border px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                        >
                          Xử lý ngay
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* POPUP MODAL */}
      {selectedStation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                ⚙️ Hiệu Chuẩn Phần Cứng: {selectedStation.name}
              </h3>
              <button
                onClick={() => setSelectedStation(null)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleCalibrateSubmit}
              className="space-y-4 text-xs font-bold"
            >
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400">
                  Tải CPU Vi mạch (%)
                </label>
                <input
                  type="number"
                  value={calibrateForm.cpuUsage}
                  onChange={(e) =>
                    setCalibrateForm({
                      ...calibrateForm,
                      cpuUsage: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-900 border rounded-xl text-emerald-400 outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400">
                  RAM (%)
                </label>
                <input
                  type="number"
                  value={calibrateForm.ramUsage}
                  onChange={(e) =>
                    setCalibrateForm({
                      ...calibrateForm,
                      ramUsage: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-900 border rounded-xl text-emerald-400 outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-400">
                  Cảm biến
                </label>
                <select
                  value={calibrateForm.sensorStatus}
                  onChange={(e) =>
                    setCalibrateForm({
                      ...calibrateForm,
                      sensorStatus: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-900 border rounded-xl text-white outline-none cursor-pointer"
                >
                  <option value="Ổn định">🟢 Ổn định</option>
                  <option value="Lỗi phần cứng">🔴 Lỗi phần cứng</option>
                </select>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border flex items-center justify-between">
                <div>
                  <p className="text-xs text-white">Xác nhận hoàn tất?</p>
                </div>
                <input
                  type="checkbox"
                  checked={calibrateForm.isFixed}
                  onChange={(e) =>
                    setCalibrateForm({
                      ...calibrateForm,
                      isFixed: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStation(null)}
                  className="w-1/2 bg-slate-800 text-slate-300 py-2.5 rounded-xl border"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-xl shadow-lg"
                >
                  ⚡ Lưu & Đồng bộ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechDashboard;
