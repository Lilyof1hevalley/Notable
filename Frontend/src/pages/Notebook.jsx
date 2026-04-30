import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Notebook() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#121212' }}>
      <div style={{ width: '250px', background: '#1e1e1e', padding: '20px', borderRight: '1px solid #333' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', color: 'teal', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '30px' }}>
          <ArrowLeft size={18}/> Back
        </button>
        <h3 style={{ fontStyle: 'italic' }}>Chapters</h3>
        <p style={{ color: '#888', cursor: 'pointer' }}>+ New Chapter</p>
      </div>

      <div style={{ flex: 1, padding: '60px 100px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input type="text" placeholder="Untitled Notebook" style={{ background: 'transparent', border: 'none', fontSize: '40px', color: 'white', fontWeight: 'bold', outline: 'none', width: '80%' }} />
          <button style={{ background: 'teal', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', display: 'flex', gap: '10px' }}>
            <Save size={18}/> Save
          </button>
        </div>
        <textarea placeholder="Start your study notes here..." style={{ background: 'transparent', border: 'none', color: '#ccc', fontSize: '18px', width: '100%', height: '70vh', marginTop: '30px', outline: 'none', resize: 'none', lineHeight: '1.6' }}></textarea>
      </div>
    </div>
  );
}