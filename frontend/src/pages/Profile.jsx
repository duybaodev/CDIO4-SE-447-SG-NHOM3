import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    role: "User",
  });

  // Đọc dữ liệu thật ngay khi truy cập trang
  useEffect(() => {
    const savedUser = localStorage.getItem("REMN_CURRENT_USER");
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      setFormData({
        id: userObj._id || userObj.id || "",
        username: userObj.username || "",
        email: userObj.email || "",
        password: "",
        role: userObj.role || "User",
      });
    } else {
      alert("⚠️ Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
      navigate("/login");
    }
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5005/api/sync/user/update-profile/${formData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        }
      );
      const result = await res.json();
      if (result.success) {
        alert("🎉 Cập nhật hồ sơ tài khoản cá nhân thành công!");
        // Ghi đè Object mới đã sửa vào dữ liệu trình duyệt
        localStorage.setItem("REMN_CURRENT_USER", JSON.stringify(result.data));
        setFormData((prev) => ({ ...prev, password: "" }));
      } else {
        alert(`❌ Lỗi: ${result.message}`);
      }
    } catch (err) {
      alert("❌ Lỗi kết nối đến máy chủ Backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            👤 Quản Lý Hồ Sơ Cá Nhân
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Thay đổi thông tin tài khoản định danh thực tế của Bảo trên hệ thống
            REMN.
          </p>
        </div>
        <form
          onSubmit={handleUpdateProfile}
          className="space-y-4 font-bold text-xs text-slate-700"
        >
          <div>
            <label className="block text-slate-400 text-[10px] uppercase mb-1">
              Tên tài khoản thật
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:bg-white text-slate-800"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-[10px] uppercase mb-1">
              Địa chỉ Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:bg-white text-slate-800"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-[10px] uppercase mb-1">
              Mật khẩu mới (Bỏ trống nếu giữ nguyên)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:bg-white text-slate-800"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-[10px] uppercase mb-1">
              Vai trò hệ thống
            </label>
            <input
              type="text"
              value={formData.role}
              className="w-full p-3 bg-slate-100 border rounded-xl text-blue-600 outline-none select-none uppercase font-black"
              disabled
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                const role = formData.role.toLowerCase();
                if (role === "admin") navigate("/admin/dashboard");
                else if (role === "tech") navigate("/tech/dashboard");
                else navigate("/dashboard"); // Hoặc hướng về trang chính Map của bạn
              }}
              className="w-1/2 bg-slate-100 text-slate-600 py-3 rounded-xl border hover:bg-slate-200 transition-colors"
            >
              Quay lại
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-lg transition-colors font-black uppercase text-xs"
            >
              {loading ? "ĐANG LƯU..." : "Xác nhận thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
