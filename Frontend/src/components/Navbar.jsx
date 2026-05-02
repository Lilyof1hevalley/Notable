import { Link } from 'react-router-dom'

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 32px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5',
    width: '100%',
  },
  logo: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#E5E5E5',
  },
  links: {
    display: 'flex',
    gap: '32px',
  },
  link: {
    textDecoration: 'none',
    fontSize: '14px',
    color: '#1A1A1A',
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    fontWeight: '600',
    letterSpacing: '0.01em',
    transition: 'color 0.15s',
  },
}

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}></div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/register" style={styles.link}>Register</Link>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
      </div>
    </nav>
  )
}

export default Navbar