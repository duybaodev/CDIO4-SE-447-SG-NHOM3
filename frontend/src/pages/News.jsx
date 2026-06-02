import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const News = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Dữ liệu mô phỏng bài viết Kiến thức & Tin tức môi trường
  const articles = [
    {
      id: 1,
      title:
        "Chỉ số bụi mịn PM2.5 tại Đà Nẵng duy trì ở mức an toàn trong tuần này",
      category: "news",
      categoryLabel: "Tin tức",
      date: "01/06/2026",
      readTime: "3 phút đọc",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format&fit=crop&q=60",
      desc: "Theo ghi nhận từ các trạm cảm biến REMN, chất lượng không khí tại các quận trung tâm Đà Nẵng đang đạt ngưỡng lý tưởng nhờ lượng mưa trải đều...",
      featured: true,
    },
    {
      id: 2,
      title: "5 mẹo bảo vệ hệ hô hấp khi chỉ số AQI vượt ngưỡng 100",
      category: "health",
      categoryLabel: "Sức khỏe",
      date: "28/05/2026",
      readTime: "5 phút đọc",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=60",
      desc: "Đeo khẩu trang chuẩn N95, sử dụng máy lọc không khí trong phòng ngủ và hạn chế tập thể dục ngoài trời vào giờ cao điểm là những việc cần làm ngay.",
      featured: false,
    },
    {
      id: 3,
      title: "Tìm hiểu về hệ thống cảm biến IOT đo nồng độ khí CO và NO2",
      category: "tech",
      categoryLabel: "Kiến thức",
      date: "25/05/2026",
      readTime: "7 phút đọc",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60",
      desc: "Khám phá nguyên lý hoạt động của các trạm cảm biến vệ tinh REMN và cách thức AI phân tích dữ liệu thô để đưa ra dự báo ô nhiễm khẩn cấp.",
      featured: false,
    },
  ];

  // Lọc bài viết theo danh mục và từ khóa tìm kiếm
  const filteredArticles = articles.filter((art) => {
    const matchesTab = activeTab === "all" || art.category === activeTab;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Tách riêng bài viết nổi bật (Featured Card)
  const featuredArticle = filteredArticles.find((art) => art.featured);
  const regularArticles = filteredArticles.filter(
    (art) => !art.featured || activeTab !== "all"
  );

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] font-sans min-h-screen w-full flex flex-col antialiased selection:bg-blue-500/10">
      {/* 1. Thanh TopNavBar Glassmorphism đồng bộ */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 h-20 shadow-sm">
        <div className="flex items-center justify-between px-6 md:px-12 h-full max-w-[1400px] mx-auto">
          <div className="flex items-center gap-8">
            <Link
              to="/dashboard"
              className="text-3xl font-black text-blue-600 tracking-tighter"
            >
              REMN
            </Link>
            <div className="hidden md:flex items-center space-x-8 ml-4">
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                Tổng quan
              </Link>
              <Link
                to="/map"
                className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                Bản đồ
              </Link>
              <Link
                to="/ranking"
                className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                Xếp hạng
              </Link>
              <Link
                to="/news"
                className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 py-1"
              >
                Tin tức
              </Link>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-md active:scale-95"
          >
            Đăng xuất
          </button>
        </div>
      </nav>

      {/* 2. Không gian chính Bento Blog */}
      <main className="flex-grow pt-28 pb-16 px-4 md:px-12 max-w-[1400px] mx-auto w-full space-y-8">
        {/* KHỐI BENTO ĐIỀU KHIỂN & TÌM KIẾM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] bg-green-50 text-green-600 font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Không gian kiến thức
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
                Tin Tức & Đời Sống Xanh
              </h1>
              <p className="text-sm text-slate-400 mt-1.5">
                Cập nhật xu hướng môi trường, cảnh báo ô nhiễm khẩn cấp và các
                bài viết khoa học đời sống.
              </p>
            </div>

            {/* Bộ Tabs danh mục */}
            <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200/40 w-fit mt-6 gap-1">
              {[
                ["all", "Tất cả"],
                ["news", "Tin tức"],
                ["health", "Sức khỏe"],
                ["tech", "Công nghệ"],
              ].map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    activeTab === tab
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Ô tìm kiếm bài đăng */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Tra cứu bài viết
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tìm nội dung bạn quan tâm
              </p>
            </div>
            <input
              type="text"
              placeholder="Nhập từ khóa tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* LƯỚI BÀI VIẾT HIỆN ĐẠI (ARTICLE GRID LAYOUT) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Khối bài viết Nổi bật (Big Bento Card) */}
          {featuredArticle && activeTab === "all" && (
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row group cursor-pointer hover:shadow-md transition-all">
              <div className="md:w-1/2 h-64 md:h-auto overflow-hidden relative">
                <img
                  src={featuredArticle.image}
                  alt="Featured"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {featuredArticle.categoryLabel}
                </span>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-between bg-gradient-to-br from-white to-slate-50/30">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span>{featuredArticle.date}</span>
                    <span>•</span>
                    <span>{featuredArticle.readTime}</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {featuredArticle.desc}
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-4">
                  Đọc chi tiết bài viết ➔
                </span>
              </div>
            </div>
          )}

          {/* 2. Danh sách các bài viết thông thường (Small Bento Cards) */}
          {regularArticles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between group cursor-pointer hover:shadow-md transition-all"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={art.image}
                  alt="Article"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {art.categoryLabel}
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span>{art.date}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {art.desc}
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600 inline-flex items-center gap-1 mt-2">
                  Đọc bài viết ➔
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trạng thái tìm kiếm trống */}
        {filteredArticles.length === 0 && (
          <div className="p-16 bg-white rounded-3xl text-center border border-slate-100">
            <p className="text-base font-bold text-slate-500">
              Không tìm thấy bài viết phù hợp
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Vui lòng thử tìm kiếm lại bằng từ khóa khác.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default News;
