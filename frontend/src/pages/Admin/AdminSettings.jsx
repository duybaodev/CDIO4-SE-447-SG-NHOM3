import React from 'react';

const AdminSettings = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h2>Cài Đặt Hệ Thống</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tên dự án:</label>
          <input type="text" defaultValue="CDIO4 SE 447 - SG NHOM 3" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tần suất nhận dữ liệu Cảm biến (giây):</label>
          <input type="number" defaultValue="5" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input type="checkbox" defaultChecked /> Bật cảnh báo qua Email khi có lỗi
          </label>
        </div>

        <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;