import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; // Thẻ Router của Bảo
import { GoogleOAuthProvider } from "@react-oauth/google"; // Thẻ Google của anh em mình

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 👑 LUẬT REACT: BrowserRouter (Router) phải là thằng bọc ngoài cùng lớn nhất */}
    <BrowserRouter>
      {/* Thằng GoogleOAuthProvider đứng thứ hai, bọc sát bên trong Router */}
      <GoogleOAuthProvider clientId="388658501691-cqn3s7m1ldca8vlgp6bju3t6tqgnd9uu.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
