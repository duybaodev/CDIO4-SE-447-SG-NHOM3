import React from 'react';

const AdminNotification = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
      <h2>Thông Báo Hệ Thống</h2>
      
      <div style={{ padding: '12px', marginBottom: '10px', borderLeft: '4px solid #dc3545', background: '#f8d7da', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 5px 0', color: '#721c24' }}>⚠️ Cảnh báo nhiệt độ</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>Cảm biến #03 vượt ngưỡng 40°C lúc 10:00 AM.</p>
      </div>

      <div style={{ padding: '12px', marginBottom: '10px', borderLeft: '4px solid #28a745', background: '#d4edda', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 5px 0', color: '#155724' }}>✅ Sao lưu dữ liệu thành công</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>Hệ thống đã hoàn tất sao lưu định kỳ tự động.</p>
      </div>
    </div>
  );
};

export default AdminNotification;