import { Link } from 'react-router-dom'

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '32px',
    padding: '14px 32px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5',
    width: '100%',
  },
  link: {
    textDecoration: 'none',
    fontSize: '14px',
    color: '#1A1A1A',
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    fontWeight: '400',
    letterSpacing: '0.01em',
    transition: 'color 0.15s',
  },
}

function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}>Home</Link>
      <Link to="/register" style={styles.link}>Register</Link>
      <Link to="/dashboard" style={styles.link}>Dashboard</Link>
    </nav>
  )
}

export default Navbar