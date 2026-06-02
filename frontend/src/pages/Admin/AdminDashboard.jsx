import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stations"); // 'stations', 'tickets', 'feedback'

  // State quản lý trung tâm phát cảnh báo khẩn cấp toàn quốc
  const [broadcastMessage, setBroadcastMessage] = useState(
    "🚨 Cảnh báo khẩn cấp: Chỉ số AQI tại khu vực Miền Bắc đang chạm ngưỡng Kém do hiện tượng sương mù quang hóa dày đặc..."
  );

  // State quản lý ghi đè thời tiết vĩ mô
  const [weatherConfig, setWeatherConfig] = useState({
    region: "center",
    temp: 27,
    humidity: 65,
    weatherAlert: "Trời quang, gió nhẹ",
  });

  // 🏢 1. Quản lý trạng thái Trạm đo (Hỗ trợ Duyệt / Dừng hoạt động / Mở lại)
  const [stations, setStations] = useState([
    {
      id: "ST-001",
      name: "Trạm Hải Châu (Trung tâm)",
      region: "Đà Nẵng",
      status: "Active",
      lastUpdate: "Vừa xong",
    },
    {
      id: "ST-009",
      name: "Trạm KCN Hòa Khánh",
      region: "Đà Nẵng",
      status: "Active",
      lastUpdate: "10 phút trước",
    },
    {
      id: "ST-014",
      name: "Trạm Hoàn Kiếm B",
      region: "Hà Nội",
      status: "Offline",
      lastUpdate: "32 phút trước",
    },
    {
      id: "ST-NEW01",
      name: "Trạm Liên Chiểu B",
      region: "Đà Nẵng",
      status: "Pending",
      lastUpdate: "Chờ duyệt",
    },
  ]);

  // 🛠️ 2. Hệ thống phân luồng mức độ ưu tiên sửa chữa trạm khẩn cấp
  const [repairTickets, setRepairTickets] = useState([
    {
      id: "TK-901",
      stationId: "ST-014",
      issue: "Mất kết nối hoàn toàn",
      priority: "Cao",
      assignee: "Nguyễn Tuấn Kiệt",
      stage: "Đang sửa chữa",
    },
    {
      id: "TK-902",
      stationId: "ST-009",
      issue: "Hỏng cảm biến vi bụi PM2.5",
      priority: "Cao",
      assignee: "Lê Hoài Bảo",
      stage: "Đang kiểm tra",
    },
    {
      id: "TK-903",
      stationId: "ST-003",
      issue: "Pin sụt giảm nguồn điện Solar",
      priority: "Trung bình",
      assignee: "Nguyễn Hồng Quân",
      stage: "Chờ linh kiện",
    },
    {
      id: "TK-904",
      stationId: "ST-022",
      issue: "Lỗi sai lệch số cấu hình CO/O3",
      priority: "Thấp",
      assignee: "Đạt",
      stage: "Đang sửa chữa",
    },
  ]);

  // 👥 3. Hệ thống tiếp nhận phản hồi báo lỗi từ người dùng
  const [feedbacks, setFeedbacks] = useState([
    {
      id: "FB-102",
      user: "Nguyễn Thị Phương Thảo",
      target: "Trạm Hải Châu",
      content:
        "Ứng dụng báo trạm này AQI tốt nhưng thực tế ngoài trời bụi mờ mịt, cần hiệu chuẩn lại cảm biến.",
      type: "Báo cáo sai số",
      processed: false,
    },
    {
      id: "FB-101",
      user: "Quang Đạt",
      target: "Hệ thống Bản đồ",
      content:
        "Trang bản đồ Leaflet load hơi chậm khi zoom vào ngõ ngách, đề xuất tối ưu hóa.",
      type: "Góp ý UI/UX",
      processed: true,
    },
  ]);

  // Xử lý đổi trạng thái trạm đo hai chiều
  const handleStationStatus = (id, newStatus) => {
    setStations(
      stations.map((st) =>
        st.id === id ? { ...st, status: newStatus, lastUpdate: "Vừa xong" } : st
      )
    );
    alert(
      `[ADMIN-CMD] Trạm ${id} đã được chuyển trạng thái sang: ${newStatus}`
    );
  };

  const changePriority = (id, newPriority) => {
    setRepairTickets(
      repairTickets.map((tk) =>
        tk.id === id ? { ...tk, priority: newPriority } : tk
      )
    );
  };

  const processFeedback = (id) => {
    setFeedbacks(
      feedbacks.map((fb) => (fb.id === id ? { ...fb, processed: true } : fb))
    );
    alert(
      `[ADMIN-CMD] Phản hồi ${id} đã được duyệt và đồng bộ chuyển lệnh kiểm tra sang đội Kỹ thuật viên!`
    );
  };

  const handleWeatherChange = (e) => {
    const { name, value } = e.target;
    setWeatherConfig((prev) => ({ ...prev, [name]: value }));
  };

  // 📢 ĐỒNG BỘ LỆNH PHÁT CẢNH BÁO XUỐNG LOCALSTORAGE TOÀN HỆ THỐNG
  const sendBroadcast = () => {
    localStorage.setItem("REMN_GLOBAL_ALERT", broadcastMessage);
    alert(
      `[BROADCAST SUCCESS] Thông điệp khẩn cấp đã được phát sóng trực tiếp lên trang chủ của toàn bộ người dùng!`
    );
  };

  // 🌤️ ĐỒNG BỘ LỆNH GHI ĐÈ THỜI TIẾT XUỐNG LOCALSTORAGE
  const submitWeatherOverride = () => {
    localStorage.setItem(
      "REMN_WEATHER_OVERRIDE",
      JSON.stringify(weatherConfig)
    );
    alert(
      `[WEATHER OVERRIDE SUCCESS] Đã đồng bộ ép dữ liệu khí tượng vùng miền xuống thiết bị người dùng!`
    );
  };

  // 📥 HÀM XUẤT FILE EXCEL CỐ ĐỊNH (Tự bóc tách dữ liệu theo Tab đang hiển thị)
  const exportToExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (activeTab === "stations") {
      csvContent += "Ma Tram,Viri Dat Tram,Khu Vuc,Trang Thai,Cap Nhat\n";
      stations.forEach(
        (s) =>
          (csvContent += `${s.id},${s.name},${s.region},${s.status},${s.lastUpdate}\n`)
      );
    } else if (activeTab === "tickets") {
      csvContent +=
        "Ma Phieu,Ma Tram,Noi Dung Su Co,Do Uu Tien,KTV Phu Trach,Tien Do\n";
      repairTickets.forEach(
        (t) =>
          (csvContent += `${t.id},${t.stationId},${t.issue},${t.priority},${t.assignee},${t.stage}\n`)
      );
    } else {
      csvContent +=
        "Ma Gop Y,Nguoi Dan Bao Loi,Doi Tuong,Noi Dung,Phan Loai,Trang Thai\n";
      feedbacks.forEach(
        (f) =>
          (csvContent += `${f.id},${f.user},${f.target},${f.content},${
            f.type
          },${f.processed ? "Da xu ly" : "Cho duyet"}\n`)
      );
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `REMN_DataReport_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] font-sans min-h-screen w-full flex flex-col antialiased selection:bg-blue-600/10">
      {/* 1. TopNavBar Thống Soái tối giản cực sang */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900 border-b border-slate-800 h-20 shadow-xl print:hidden">
        <div className="flex items-center justify-between px-6 md:px-12 h-full max-w-[1440px] mx-auto">
          <span className="text-2xl font-black text-white tracking-tighter">
            REMN{" "}
            <span className="text-xs bg-red-500 text-white font-black px-2 py-0.5 rounded ml-1 tracking-normal font-bold">
              SUPER GENERAL
            </span>
          </span>
          <div className="flex items-center gap-4">
            <div className="bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-red-400">
              ⚡ Trung tâm tổng điều hành vĩ mô
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Cấu trúc lưới phân vùng thông minh Split-Grid Layout */}
      <div className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================
            CỘT TRÁI (CHIẾM 8 CỘT): KHÔNG GIAN BẢNG BIỂU HÀNH CHÍNH & DÂN CƯ
            ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* Thanh công cụ tiêu đề & Nút kết xuất báo cáo cố định */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Cơ Sở Dữ Liệu & Hạ Tầng Cảm Biến
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Xử lý cô lập thiết bị hỏng, phân luồng nhân sự sửa chữa và duyệt
                ý kiến dân cư.
              </p>
            </div>

            {/* Bộ công cụ In & Xuất Excel cố định */}
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={exportToExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                📥 Xuất Excel (.CSV)
              </button>
              <button
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
              >
                🖨️ In PDF
              </button>
            </div>
          </div>

          {/* Khung Bento chứa bảng danh mục phân Tab */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            {/* Menu chuyển đổi Tab bên trong Bảng */}
            <div className="p-4 border-b border-slate-100 flex bg-slate-50/60 gap-1 print:hidden">
              {[
                ["stations", "🏢 Trạng thái & Điều khiển Trạm"],
                ["tickets", "🛠️ Tiến độ sửa chữa ưu tiên"],
                ["feedback", "👥 Phản hồi lỗi từ người dân"],
              ].map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all ${
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* TAB 1: QUẢN LÝ TRẠM ĐO CÓ NÚT DỪNG HOẠT ĐỘNG */}
            {activeTab === "stations" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Mã Trạm</th>
                      <th className="py-4 px-6">Vị Trí Đặt Trạm</th>
                      <th className="py-4 px-6">Khu Vực</th>
                      <th className="py-4 px-6 text-center">Trạng Thái</th>
                      <th className="py-4 px-8 text-center print:hidden">
                        Quyết Định Thao Tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-semibold">
                    {stations.map((st) => (
                      <tr
                        key={st.id}
                        className="hover:bg-slate-50/40 transition-colors"
                      >
                        <td className="py-4 px-6 font-mono text-xs text-slate-400">
                          {st.id}
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-800">
                          {st.name}
                        </td>
                        <td className="py-4 px-6 text-slate-500">
                          {st.region}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
                              st.status === "Active"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : st.status === "Pending"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {st.status}
                          </span>
                        </td>
                        <td className="py-4 px-8 text-center print:hidden">
                          <div className="flex items-center justify-center gap-1.5">
                            {st.status === "Pending" && (
                              <button
                                onClick={() =>
                                  handleStationStatus(st.id, "Active")
                                }
                                className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
                              >
                                ✓ Duyệt chạy
                              </button>
                            )}
                            {st.status === "Active" && (
                              <button
                                onClick={() =>
                                  handleStationStatus(st.id, "Disabled")
                                }
                                className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-100"
                              >
                                ⛔ Dừng trạm
                              </button>
                            )}
                            {st.status === "Disabled" && (
                              <button
                                onClick={() =>
                                  handleStationStatus(st.id, "Active")
                                }
                                className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
                              >
                                🔄 Kích hoạt lại
                              </button>
                            )}
                            {st.status === "Offline" && (
                              <span className="text-xs text-slate-400 font-medium">
                                Mất nguồn phần cứng
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "tickets" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Mã Phiếu</th>
                      <th className="py-4 px-6">Mã Trạm</th>
                      <th className="py-4 px-6">Nội Dung Sự Cố Phần Cứng</th>
                      <th className="py-4 px-6 text-center">Độ Ưu Tiên</th>
                      <th className="py-4 px-6 text-center">KTV Nhận Lệnh</th>
                      <th className="py-4 px-8 text-center">Tiến Độ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-semibold">
                    {repairTickets.map((tk) => (
                      <tr
                        key={tk.id}
                        className="hover:bg-slate-50/40 transition-colors"
                      >
                        <td className="py-4 px-6 font-mono text-xs text-slate-400">
                          {tk.id}
                        </td>
                        <td className="py-4 px-6 font-mono text-xs text-blue-600 font-bold">
                          {tk.stationId}
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-800">
                          {tk.issue}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <select
                            value={tk.priority}
                            onChange={(e) =>
                              changePriority(tk.id, e.target.value)
                            }
                            className={`text-xs font-black px-2 py-1 rounded border outline-none cursor-pointer ${
                              tk.priority === "Cao"
                                ? "bg-red-50 text-red-600 border-red-100"
                                : "bg-slate-50 text-slate-500"
                            }`}
                          >
                            <option value="Cao">🚨 Cao (Sửa ngay)</option>
                            <option value="Trung bình">⏳ Trung bình</option>
                            <option value="Thấp">🍃 Thấp</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-center text-xs font-bold text-slate-600">
                          {tk.assignee}
                        </td>
                        <td className="py-4 px-8 text-center">
                          <span className="text-xs font-bold bg-slate-900 text-slate-300 px-3 py-1.5 rounded-xl animate-pulse">
                            {tk.stage}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "feedback" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Người Dân Gửi</th>
                      <th className="py-4 px-6">Trạm Bị Phản Ánh</th>
                      <th className="py-4 px-6">
                        Nội Dung Khảo Sát Lỗi Từ Dân
                      </th>
                      <th className="py-4 px-6 text-center">
                        Phân Loại Trục Trặc
                      </th>
                      <th className="py-4 px-8 text-center print:hidden">
                        Xử Lý Đơn Phiếu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-semibold">
                    {feedbacks.map((fb) => (
                      <tr
                        key={fb.id}
                        className="hover:bg-slate-50/40 transition-colors"
                      >
                        <td className="py-4 px-6 font-bold text-slate-800">
                          {fb.user}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 font-bold">
                          {fb.target}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-600 max-w-xs leading-relaxed">
                          {fb.content}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-[11px] bg-red-50 text-red-500 px-2 py-0.5 rounded font-bold">
                            {fb.type}
                          </span>
                        </td>
                        <td className="py-4 px-8 text-center print:hidden">
                          {fb.processed ? (
                            <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-md">
                              ✓ Đã duyệt thông tin
                            </span>
                          ) : (
                            <button
                              onClick={() => processFeedback(fb.id)}
                              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm"
                            >
                              ⚡ Duyệt lỗi chuyển KTV
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            CỘT PHẢI (CHIẾM 4 CỘT): TRUNG TÂM ĐIỀU PHỐI KHẨN CẤP & OVERRIDE 
            ======================================================== */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          {/* Widget 1: Phát thanh cảnh báo toàn quốc kết nối thời gian thực */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">📢</span>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Phát cảnh báo toàn hệ thống
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Nội dung cảnh báo sẽ đè trực tiếp lên thanh Alert của trang chủ
                User ngay lập tức.
              </p>
            </div>
            <textarea
              rows="3"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-blue-500 transition-all"
            />
            <button
              onClick={sendBroadcast}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              🚨 Phát thông điệp khẩn cấp (Broadcast)
            </button>
          </div>

          {/* Widget 2: Ghi đè điều khiển thời tiết thủ công */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🌤️</span>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Điều khiển khí tượng thủ công
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ghi đè dữ liệu thời tiết trang chủ các vùng miền khi trạm gặp
                thiên tai.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Miền áp đặt thông số
                </label>
                <select
                  name="region"
                  value={weatherConfig.region}
                  onChange={handleWeatherChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="north">Miền Bắc (Thủ đô Hà Nội)</option>
                  <option value="center">Miền Trung (Thành phố Đà Nẵng)</option>
                  <option value="south">Miền Nam (TP. Hồ Chí Minh)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Nhiệt độ (°C)
                  </label>
                  <input
                    type="number"
                    name="temp"
                    value={weatherConfig.temp}
                    onChange={handleWeatherChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Độ ẩm (%)
                  </label>
                  <input
                    type="number"
                    name="humidity"
                    value={weatherConfig.humidity}
                    onChange={handleWeatherChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Trạng thái khí tượng vĩ mô
                </label>
                <input
                  type="text"
                  name="weatherAlert"
                  value={weatherConfig.weatherAlert}
                  onChange={handleWeatherChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <button
              onClick={submitWeatherOverride}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              🌤️ Đồng bộ phát sóng dữ liệu khí tượng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
