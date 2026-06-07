import React from "react";
import { Routes, Route } from "react-router-dom";

// 1. Nạp chính xác các trang giao diện thật của Bảo
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Map from "../pages/Map";
import Ranking from "../pages/Ranking";
import News from "../pages/News";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import TechDashboard from "../pages/tech/TechDashboard";
import Devices from "../pages/tech/Devices";
import Logs from "../pages/tech/Logs";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";

// 2. Khối giữ chỗ tạm thời cho các trang chưa làm (Đảm bảo không bị crash lỗi)
const Placeholder = ({ name }) => (
  <div className="min-h-screen bg-[#faf8ff] flex flex-col justify-center items-center font-sans text-slate-700">
    <div className="text-4xl mb-2">🚧</div>
    <h1 className="text-xl font-bold uppercase tracking-wider">
      Phân hệ: {name}
    </h1>
    <p className="text-xs text-slate-400 mt-1">
      Giao diện v0 đang được thiết kế và lắp ráp...
    </p>
    <a
      href="/dashboard"
      className="mt-6 px-4 py-2 bg-[#0058be] text-white rounded-xl text-xs font-semibold"
    >
      Quay về Trang chủ
    </a>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Tuyến đường cổng vào ứng dụng */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login-form" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔥 ĐỔI TUYẾN ĐƯỜNG NÀY: Trỏ thẳng /dashboard vào giao diện Dashboard mới tích hợp biểu đồ & AI của Bảo */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Giữ lại trang Home cũ của nhóm tại đường dẫn dự phòng để đối chiếu nếu cần */}
      <Route path="/old-home" element={<Home />} />

      {/* Tuyến đường dẫn sang trang Bản đồ thật */}
      <Route path="/map" element={<Map />} />

      {/* Các trang còn lại trong hệ thống REMN */}
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/news" element={<News />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tech/dashboard" element={<TechDashboard />} />
      <Route path="/tech/devices" element={<Devices />} />
      <Route path="/tech/logs" element={<Logs />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Điều hướng các đường dẫn lạ về trang 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
