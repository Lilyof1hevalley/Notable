import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Search, Plus, X, Filter, ArrowUpDown, Circle } from 'lucide-react';

// --- KOMPONEN DALAM SATU FILE (UNTUK TES) ---
const Navbar = () => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
    <h1 style={{ fontFamily: 'serif', fontStyle: 'italic' }}>Hello, Nadira</h1>
    <div style={{ display: 'flex', gap: '10px', background: '#333', padding: '10px', borderRadius: '20px' }}>
      <Search size={18} />
      <input placeholder="Search" style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none' }} />
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '30px', background: '#2D2D2D', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {/* Notebook Card */}
        <div 
          onClick={() => navigate('/notebook')}
          style={{ background: '#E5E5E5', color: '#333', height: '150px', borderRadius: '15px', padding: '20px', cursor: 'pointer', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-10px', left: 0, width: '60px', height: '20px', background: '#E5E5E5', borderRadius: '10px 10px 0 0' }}></div>
          <b>Software Engineering</b>
          <p style={{ fontSize: '12px' }}>3 Tasks</p>
        </div>
      </div>
      {/* Floating Button */}
      <div style={{ position: 'fixed', bottom: '30px', right: '30px', background: 'teal', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
        <Plus color="white" />
      </div>
    </div>
  );
};

const Notebook = () => (
  <div style={{ background: '#121212', height: '100vh', color: 'white', padding: '50px' }}>
    <h1>Notebook Editor</h1>
    <textarea style={{ width: '100%', height: '80%', background: 'transparent', color: 'white', border: '1px solid #333', borderRadius: '10px', padding: '20px' }} placeholder="Start typing..."></textarea>
    <br/><br/>
    <a href="/" style={{ color: 'teal' }}>Back to Dashboard</a>
  </div>
);

// --- APP UTAMA ---
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notebook" element={<Notebook />} />
      </Routes>
    </Router>
  );
}