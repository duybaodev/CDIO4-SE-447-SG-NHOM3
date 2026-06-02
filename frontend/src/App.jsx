import React from "react";
import AppRoutes from "./routes/AppRoutes"; // Triệu hồi Trục lộ tuyến trung tâm

function App() {
  return (
    <>
      {/* Tự động quét đường link trên trình duyệt để nạp giao diện tương ứng */}
      <AppRoutes />
    </>
  );
}

export default App;
