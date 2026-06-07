const API_URL = "http://localhost:5005/api";

// Hàm cấu hình Headers tự động đính kèm mã xác thực Token sau khi đăng nhập
const getHeaders = () => {
  const token = localStorage.getItem("REMN_USER_TOKEN");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// 1. Gọi cấp dữ liệu trạm IoT thực tế từ máy chủ
export const fetchDevicesFromServer = async () => {
  const res = await fetch(`${API_URL}/devices`, {
    method: "GET",
    headers: getHeaders(),
  });
  return res.json();
};

// 2. Gửi lệnh Admin thay đổi trạng thái trạm đo xuống database
export const updateStationStatusOnServer = async (deviceId, status) => {
  const res = await fetch(`${API_URL}/devices/${deviceId}/status`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
};

// 3. Gọi cấp dữ liệu xếp hạng không khí thời gian thực
export const fetchAirRankingFromServer = async () => {
  const res = await fetch(`${API_URL}/ranking`, { method: "GET" });
  return res.json();
};
