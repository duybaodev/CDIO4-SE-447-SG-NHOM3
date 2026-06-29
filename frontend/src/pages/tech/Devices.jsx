import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Devices = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceList, setDeviceList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHardwareDevices = async () => {
    try {
      setLoading(true);
      // 🟢 ĐÃ SỬA: Thay đổi link lấy dữ liệu trạm thật từ Compass
      const res = await fetch(
        "http://localhost:5005/api/air-quality/map/locations"
      );
      const result = await res.json();
      const rawStations = result.data || result;

      if (Array.isArray(rawStations)) {
        setDeviceList(
          rawStations.map((s) => ({
            id: s._id,
            name: s.name,
            type: s.version || "Station V2.5",
            cpu: s.hardwareSpecs?.cpuUsage
              ? `${s.hardwareSpecs.cpuUsage}%`
              : `${Math.floor(Math.random() * 25) + 15}%`,
            ram: s.hardwareSpecs?.ramUsage
              ? `${s.hardwareSpecs.ramUsage}%`
              : `${Math.floor(Math.random() * 30) + 35}%`,
            pm25_status:
              s.status === "Active"
                ? "Good"
                : s.status === "Disabled"
                ? "Calibrating"
                : "Offline",
            gas_sensor:
              s.hardwareSpecs?.sensorStatus ||
              (s.status === "Active" ? "Ổn định" : "Lỗi vi mạch"),
          }))
        );
      }
    } catch (err) {
      console.error("Lỗi đồng bộ thiết bị phần cứng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHardwareDevices();
  }, []);

  const triggerHardwareAction = async (id, actionName, stationName) => {
    if (actionName === "REBOOT") {
      if (
        window.confirm(
          `Bảo có chắc chắn phát lệnh REBOOT từ xa đến trạm ${stationName}?`
        )
      ) {
        try {
          await fetch(`http://localhost:5005/api/sync/tech/calibrate/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cpuUsage: 12,
              ramUsage: 35,
              sensorStatus: "Ổn định",
              isFixed: true,
            }),
          });
          alert(
            `[REBOOT COMMAND SUCCESS] Trạm ${stationName} khởi động lại thành công!`
          );
          fetchHardwareDevices();
        } catch (err) {
          alert("Lỗi gửi lệnh điều khiển!");
        }
      }
    } else {
      alert(
        `[ĐIỀU HƯỚNG] Quay lại trung tâm để dùng panel Calibrate cho trạm ${stationName}.`
      );
      navigate("/tech/dashboard");
    }
  };

  const filteredDevices = deviceList.filter(
    (dev) =>
      dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#0f172a] text-[#f8fafc] font-sans min-h-screen w-full flex flex-col antialiased">
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
                className="text-sm font-bold text-blue-400 border-b-2 border-blue-400 py-1"
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
          <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/50 px-4 py-2 rounded-xl text-xs font-bold text-slate-300">
            KTV: Lê Hoài Bảo
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-28 pb-16 px-4 md:px-12 max-w-[1440px] mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-[#1e293b] p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Linh kiện & Phần cứng
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight mt-3">
                Chi Tiết Vi Mạch Trạm Cảm Biến
              </h1>
            </div>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 flex flex-col justify-between gap-4">
            <input
              type="text"
              placeholder="Tìm trạm phần cứng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700/60 rounded-xl text-xs font-semibold outline-none text-white focus:border-blue-500 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#151f32]/60 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="py-4 px-6">Mã Board</th>
                <th className="py-4 px-6">Tên Trạm Vận Hành</th>
                <th className="py-4 px-6 text-center">Tải CPU</th>
                <th className="py-4 px-6 text-center">Tải RAM</th>
                <th className="py-4 px-6 text-center">Sensor PM2.5</th>
                <th className="py-4 px-6 text-center">Khí Cảm Biến</th>
                <th className="py-4 px-8 text-center">Lệnh Điều Khiển Từ Xa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-slate-500">
                    Đang tải xung phần cứng từ MongoDB...
                  </td>
                </tr>
              ) : (
                filteredDevices.map((dev) => (
                  <tr
                    key={dev.id}
                    className="hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className="font-mono text-[10px] bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-blue-400 font-bold truncate max-w-[90px] inline-block">
                        {dev.id}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-white">{dev.name}</p>
                        <p className="text-xs text-slate-500 font-normal mt-0.5">
                          {dev.type}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-xs">
                      {dev.cpu}
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-xs">
                      {dev.ram}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          dev.pm25_status === "Good"
                            ? "bg-emerald-500"
                            : dev.pm25_status === "Calibrating"
                            ? "bg-amber-500 animate-pulse"
                            : "bg-red-500"
                        }`}
                      ></span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border">
                        {dev.gas_sensor}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            triggerHardwareAction(dev.id, "REBOOT", dev.name)
                          }
                          className="bg-slate-800 hover:bg-amber-600 hover:text-white text-amber-500 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                        >
                          🔄 Reboot
                        </button>
                        <button
                          onClick={() =>
                            triggerHardwareAction(dev.id, "CALIBRATE", dev.name)
                          }
                          className="bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-400 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                        >
                          🎛️ Calibrate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Devices;
