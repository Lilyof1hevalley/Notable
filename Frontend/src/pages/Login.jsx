import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#121212' }}>
      <div style={{ background: '#1e1e1e', padding: '50px', borderRadius: '30px', width: '400px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <h1 style={{ fontFamily: 'Georgia', fontStyle: 'italic', marginBottom: '40px' }}>NOTABLE</h1>
        <input type="email" placeholder="Email" style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '12px', border: '1px solid #333', background: '#121212', color: 'white', boxSizing: 'border-box' }} />
        <input type="password" placeholder="Password" style={{ width: '100%', padding: '15px', marginBottom: '30px', borderRadius: '12px', border: '1px solid #333', background: '#121212', color: 'white', boxSizing: 'border-box' }} />
        <Link to="/dashboard">
          <button style={{ width: '100%', padding: '15px', background: 'teal', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Sign In</button>
        </Link>
        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          New here? <Link to="/register" style={{ color: 'teal', textDecoration: 'none' }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
}