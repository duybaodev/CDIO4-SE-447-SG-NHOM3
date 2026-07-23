import React from 'react';

const SystemLogs = () => {
  const logs = [
    { id: 1, time: '10:15 - 23/07/2026', user: 'admin@system.com', action: 'Cập nhật cấu hình Cảm biến #1' },
    { id: 2, time: '09:30 - 23/07/2026', user: 'haitchdo', action: 'Đăng nhập vào hệ thống' },
    { id: 3, time: '18:45 - 22/07/2026', user: 'duybaodev', action: 'Tạo tài khoản mới cho User' },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Lịch Sử Hoạt Động (System Logs)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
        <thead>
          <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>#</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Thời gian</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tài khoản</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.time}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}><strong>{log.user}</strong></td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SystemLogs;