import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_BASE = 'http://localhost:3000/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed. Please try again.')
      } else {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      }
    } catch {
      setError('Unable to connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/register" style={styles.navLink}>Register</Link>
        <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
      </nav>

      {/* Page content */}
      <div style={styles.content}>
        <h1 style={styles.heading}>Log In</h1>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Login to your Account</h2>
          <p style={styles.cardSubtitle}>Enter your email and password</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
              <div style={styles.forgotRow}>
                <Link to="/reset-password" style={styles.forgotLink}>Forgot Password?</Link>
              </div>
            </div>

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>OR</span>
            <span style={styles.dividerLine} />
          </div>

          <button style={styles.googleBtn} type="button">
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: 8 }}>
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.switchLink}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
    backgroundColor: '#F9F9F9',
  },
  nav: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 32,
    padding: '14px 32px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5',
  },
  navLink: {
    textDecoration: 'none',
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: "'Inria Sans', sans-serif",
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 48,
  },
  heading: {
    fontFamily: "'Inria Sans', sans-serif",
    fontSize: 36,
    fontWeight: 700,
    color: '#0D1B2A',
    marginBottom: 24,
    letterSpacing: '-0.5px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: 12,
    padding: '32px 36px',
    width: '100%',
    maxWidth: 440,
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    fontFamily: "'Inria Sans', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: '#0D1B2A',
    margin: 0,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#888',
    margin: '0 0 20px 0',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: 6,
    padding: '10px 14px',
    fontSize: 13,
    color: '#DC2626',
    marginBottom: 16,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#374151',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: 6,
    fontSize: 14,
    color: '#1A1A1A',
    outline: 'none',
    backgroundColor: '#FAFAFA',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.15s',
  },
  forgotRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  forgotLink: {
    fontSize: 12,
    color: '#6B7280',
    textDecoration: 'none',
  },
  btn: {
    backgroundColor: '#0D1B2A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 6,
    padding: '12px 0',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    marginTop: 4,
    transition: 'opacity 0.15s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '20px 0',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: 500,
  },
  googleBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '11px 0',
    border: '1px solid #D1D5DB',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#374151',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
  },
  switchText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#6B7280',
    marginTop: 20,
    marginBottom: 0,
  },
  switchLink: {
    color: '#0D1B2A',
    fontWeight: 600,
    textDecoration: 'none',
  },
}

export default Login