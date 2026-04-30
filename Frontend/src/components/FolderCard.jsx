import React from 'react';

export default function FolderCard({ title, taskCount, onClick }) {
  return (
    <div onClick={onClick} className="card" style={{ 
      background: 'var(--bg-card)', color: 'var(--text-dark)', padding: '20px', 
      borderRadius: '15px', position: 'relative', height: '170px',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    }}>
      {/* Folder Tab */}
      <div style={{ position: 'absolute', top: '-10px', left: 0, width: '80px', height: '25px', background: 'var(--bg-card)', borderRadius: '12px 12px 0 0' }}></div>
      
      {/* Visual Placeholder (Garis Silang) */}
      <div style={{ position: 'absolute', top: '25px', left: '20px', right: '20px', bottom: '65px', border: '1px solid #bbb' }}>
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to top right, transparent 49%, #bbb 50%, transparent 51%), linear-gradient(to top left, transparent 49%, #bbb 50%, transparent 51%)' }}></div>
      </div>

      <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{title}</div>
      <div style={{ fontSize: '11px', opacity: 0.7 }}>To-Do : {taskCount} tasks</div>
    </div>
  );
}