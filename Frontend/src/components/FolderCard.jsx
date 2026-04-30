import React from 'react';

export default function FolderCard({ title, taskCount, onClick }) {
  return (
    <div onClick={onClick} style={{ 
      background: 'var(--bg-card)', color: '#333', padding: '20px', 
      borderRadius: '15px', position: 'relative', height: '160px',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      cursor: 'pointer', transition: 'transform 0.2s'
    }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
       onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{ position: 'absolute', top: '-10px', left: '0', width: '80px', height: '25px', background: 'var(--bg-card)', borderRadius: '12px 12px 0 0' }}></div>
      <div style={{ fontWeight: 'bold' }}>{title}</div>
      <div style={{ fontSize: '12px', opacity: 0.7 }}>To-Do: {taskCount} tasks</div>
    </div>
  );
}