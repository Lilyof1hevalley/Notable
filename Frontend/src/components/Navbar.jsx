import { Search, X, Filter, ArrowUpDown } from 'lucide-react';

export default function Navbar({ userName }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '32px', margin: 0 }}>Hello, {userName}</h1>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ background: '#333', padding: '8px 15px', borderRadius: '25px', display: 'flex', alignItems: 'center', gap: '10px', width: '250px' }}>
          <Search size={18} color="#999" />
          <input type="text" placeholder="Search" style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }} />
          <X size={16} color="#999" cursor="pointer" />
        </div>
        <Filter size={22} cursor="pointer" />
        <ArrowUpDown size={22} cursor="pointer" />
      </div>
    </header>
  );
}