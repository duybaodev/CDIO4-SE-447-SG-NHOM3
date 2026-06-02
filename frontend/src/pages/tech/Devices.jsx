import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Devices = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Dữ liệu mô phỏng tình trạng chi tiết linh kiện phần cứng bên trong các trạm IOT
  const [deviceList, setDeviceList] = useState([
    {
      id: "ST-001",
      name: "Trạm Hải Châu (Trung tâm)",
      type: "Station V2.5",
      cpu: "12%",
      ram: "42%",
      pm25_status: "Good",
      co_status: "Good",
      gas_sensor: "Ổn định",
      actionRequired: false,
    },
    {
      id: "ST-009",
      name: "Trạm KCN Hòa Khánh",
      type: "Station V2.5",
      cpu: "94%",
      ram: "88%",
      pm25_status: "Error",
      co_status: "Good",
      gas_sensor: "Lỗi phần cứng",
      actionRequired: true,
    },
    {
      id: "ST-014",
      name: "Trạm Hoàn Kiếm B",
      type: "Station V2.0",
      cpu: "0%",
      ram: "0%",
      pm25_status: "Offline",
      co_status: "Offline",
      gas_sensor: "Mất nguồn",
      actionRequired: true,
    },
    {
      id: "ST-022",
      name: "Trạm Chợ Bến Thành",
      type: "Station V2.5",
      cpu: "34%",
      ram: "51%",
      pm25_status: "Calibrating",
      co_status: "Good",
      gas_sensor: "Đang hiệu chuẩn",
      actionRequired: false,
    },
  ]);

  // Hàm giả lập kích hoạt lệnh điều khiển phần cứng từ xa
  const triggerHardwareAction = (id, actionName) => {
    alert(
      `[REMN-IOT-CMD] Đã gửi tín hiệu ${actionName} từ xa đến Trạm phần cứng mã số: ${id}`
    );
  };

  const filteredDevices = deviceList.filter(
    (dev) =>
      dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#0f172a] text-[#f8fafc] font-sans min-h-screen w-full flex flex-col antialiased selection:bg-blue-500/20">
      {/* 1. Thanh TopNavBar phân hệ Kỹ thuật viên (Đồng bộ Dark Theme) */}
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
                to="#"
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
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

      {/* 2. Không gian Bento Điều hành thiết bị phần cứng */}
      <main className="flex-grow pt-28 pb-16 px-4 md:px-12 max-w-[1440px] mx-auto w-full space-y-6">
        {/* Thanh tìm kiếm và tiêu đề bento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-[#1e293b] p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Linh kiện & Phần cứng
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight mt-3">
                Chi Tiết Vi Mạch Trạm Cảm Biến
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Quản lý hiệu năng CPU/RAM bo mạch, kiểm tra tình trạng kết nối
                vi cảm biến quang học từ xa.
              </p>
            </div>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Định vị mã trạm
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Nhập mã định danh IOT hoặc tên trạm đo
              </p>
            </div>
            <input
              type="text"
              placeholder="Tìm trạm phần cứng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700/60 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 transition-all text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Khung Bento bảng vi mạch thiết bị */}
        <div className="bg-[#1e293b] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#151f32]/60 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <th className="py-4 px-6">Mã Board</th>
                  <th className="py-4 px-6">Tên Trạm Vận Hành</th>
                  <th className="py-4 px-6 text-center">Tải CPU</th>
                  <th className="py-4 px-6 text-center">Tải RAM</th>
                  <th className="py-4 px-6 text-center">Sensor PM2.5</th>
                  <th className="py-4 px-6 text-center">Khí Cảm Biến</th>
                  <th className="py-4 px-8 text-center">
                    Lệnh Điều Khiển Từ Xa
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm font-medium">
                {filteredDevices.map((dev) => (
                  <tr
                    key={dev.id}
                    className="hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="py-4 px-6 font-mono text-xs text-blue-400 font-bold">
                      {dev.id}
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
                            : "bg-red-500 animate-ping"
                        }`}
                        title={dev.pm25_status}
                      ></span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                        {dev.gas_sensor}
                      </span>
                    </td>
                    {/* KHỐI NÚT LỆNH ĐIỀU KHIỂN SỬA LỖI PHẦN CỨNG TỪ XA */}
                    <td className="py-4 px-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            triggerHardwareAction(
                              dev.id,
                              "REBOOT (KHỞI ĐỘNG LẠI BOARD)"
                            )
                          }
                          className="bg-slate-800 hover:bg-amber-600 hover:text-white text-amber-500 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                        >
                          🔄 Reboot
                        </button>
                        <button
                          onClick={() =>
                            triggerHardwareAction(
                              dev.id,
                              "CALIBRATE (HIỆU CHUẨN SENSOR)"
                            )
                          }
                          className="bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-400 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                        >
                          🎛️ Calibrate
                        </button>
                      </div>
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

export default Devices;
