import React from 'react';

const AdminProfile = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h2>Hồ Sơ Quản Trị Viên</h2>
      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#f9f9f9' }}>
        <p><strong>Họ và tên:</strong> Quản Trị Viên</p>
        <p><strong>Email:</strong> admin@system.com</p>
        <p><strong>Chức vụ:</strong> System Administrator</p>
        <p><strong>Trạng thái:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>Đang hoạt động</span></p>
        <button style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Chỉnh sửa thông tin
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;