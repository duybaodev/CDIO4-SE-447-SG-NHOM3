import React, { useState } from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  // Quản lý trạng thái chuyển slide tính năng cho trực quan
  const [activeSlide, setActiveSlide] = useState(0);

  const features = [
    {
      id: 0,
      icon: "⚡",
      title: "Dự báo AI",
      desc: "Dự đoán biến động chất lượng không khí chính xác trong vòng 72 giờ tới nhờ mô hình máy học chuyên sâu.",
    },
    {
      id: 1,
      icon: "🗺️",
      title: "Bản đồ nhiệt",
      desc: "Theo dõi chi tiết dải màu ô nhiễm bụi mịn trực quan trên bản đồ số theo thời gian thực tại khu vực của bạn.",
    },
    {
      id: 2,
      icon: "🔔",
      title: "Cảnh báo sớm",
      desc: "Gửi thông báo khẩn cấp ngay khi nồng độ chỉ số AQI đạt ngưỡng nguy hại để bảo vệ sức khỏe gia đình.",
    },
  ];

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen w-full flex items-center justify-center font-sans overflow-hidden relative">
      {/* Khung giao diện chính phối hợp hai nửa tương phản */}
      <main className="w-full max-w-[1440px] h-[921px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 mx-4 md:mx-10 relative z-10">
        {/* NỬA BÊN TRÁI: Nhận diện thương hiệu & AQI hiện tại */}
        <section className="bg-gradient-to-br from-[#22c55e] to-[#0058be] p-12 lg:p-16 flex flex-col justify-between text-white relative">
          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl w-fit font-bold tracking-wider text-xl shadow-sm">
            REMN
          </div>

          <div className="max-w-[420px] mx-auto text-center my-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
              Hơi thở trong lành cho cuộc sống tươi đẹp
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Giải pháp giám sát chất lượng không khí thông minh thế hệ mới,
              mang lại sự an tâm tuyệt đối cho gia đình bạn.
            </p>

            {/* Widget hiển thị trạm đo thực tế tại Đà Nẵng */}
            <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-6 rounded-2xl text-left shadow-lg backdrop-filter mt-8 hover:scale-105 transition-all duration-300">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold opacity-90 flex items-center gap-1.5">
                  📍 Vị trí của bạn
                </span>
                <span className="w-2.5 h-2.5 bg-[#22C55E] rounded-full animate-ping"></span>
              </div>
              <h3 className="text-xl font-bold mb-4">Đà Nẵng, VN</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black tracking-tighter">32</span>
                <div>
                  <span className="text-xs bg-[#22C55E] px-2 py-0.5 rounded-md font-bold block w-fit">
                    Tốt
                  </span>
                  <span className="text-[10px] opacity-70 block mt-0.5">
                    AQI US
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-white/60">
            © 2026 REMN AIR QUALITY. Đồ án CDIO 4 - Nhóm 3.
          </div>
        </section>

        {/* NỬA BÊN PHẢI: Điều hướng & Khám phá tính năng gọn gàng */}
        <section className="p-12 lg:p-20 flex flex-col justify-between bg-white relative z-10">
          {/* Header Chào mừng gọn gàng */}
          <div className="max-w-[460px] w-full mx-auto my-auto space-y-10">
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                Chào mừng bạn
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Hệ thống nền tảng ứng dụng công nghệ AI hàng đầu giúp theo dõi,
                phân tích dữ liệu chỉ số môi trường xung quanh nơi bạn sống.
              </p>
            </div>

            {/* Bộ đôi nút bấm điều hướng siêu chất - Đã làm sạch lỗi comment */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link
                to="/register"
                className="flex-1 text-center py-4 bg-[#0058be] hover:bg-[#2170e4] text-white rounded-xl font-bold shadow-lg shadow-[#0058be]/20 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
              >
                Đăng ký tài khoản
                <span>✨</span>
              </Link>

              <Link
                to="/login-form"
                className="flex-1 text-center py-4 border-2 border-slate-200 hover:border-[#0058be] hover:bg-[#0058be]/5 text-[#0058be] rounded-xl font-bold active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
              >
                Đăng nhập ngay
                <span>➔</span>
              </Link>
            </div>

            {/* Phân hệ Khám phá tính năng nổi bật được đưa lên làm điểm nhấn */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Tính năng nổi bật hệ thống
              </h4>

              {/* Hiển thị danh sách thẻ tính năng dạng Grid cực kỳ khoa học */}
              <div className="grid grid-cols-1 gap-3">
                {features.map((feat) => (
                  <div
                    key={feat.id}
                    onClick={() => setActiveSlide(feat.id)}
                    className={`p-4 border rounded-xl transition-all cursor-pointer flex gap-4 items-start ${
                      activeSlide === feat.id
                        ? "border-[#0058be] bg-[#0058be]/5 shadow-sm"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-2xl p-1.5 bg-white rounded-lg shadow-sm border border-slate-100">
                      {feat.icon}
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-bold text-sm text-slate-800">
                        {feat.title}
                      </h5>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer nhỏ nhẹ nhàng ở góc dưới */}
          <div className="flex justify-between items-center text-xs text-slate-400 max-w-[460px] w-full mx-auto pt-6">
            <a href="#" className="hover:text-primary transition-all">
              Điều khoản
            </a>
            <a href="#" className="hover:text-primary transition-all">
              Bảo mật
            </a>
            <a href="#" className="hover:text-primary transition-all">
              Hỗ trợ kỹ thuật
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Welcome;
