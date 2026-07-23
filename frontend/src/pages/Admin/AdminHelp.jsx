import React from 'react';

const AdminHelp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Trung Tâm Trợ Giúp Admin</h2>
      <details style={{ marginBottom: '10px', padding: '10px', border: '1px solid #eee' }}>
        <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>Làm sao để thêm Cảm biến mới?</summary>
        <p>Vào mục "Sensor Management" $\rightarrow$ Chọn nút "Thêm Cảm Biến" và điền thông số kĩ thuật.</p>
      </details>
      <details style={{ marginBottom: '10px', padding: '10px', border: '1px solid #eee' }}>
        <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>Làm sao để phân quyền người dùng?</summary>
        <p>Vào mục "User Management" $\rightarrow$ Chọn tài khoản $\rightarrow$ Thay đổi vai trò (Role) thành Admin/User.</p>
      </details>
    </div>
  );
};

export default AdminHelp;