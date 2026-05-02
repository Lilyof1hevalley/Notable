import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleLogin(event) {
    event.preventDefault()
    setError('')

    // Basic format validation so it feels real
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    // Fake loading delay
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1200)
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        {/* Logo / brand */}
        <div style={styles.brand}>
          <span style={styles.brandName}>Notable</span>
          <p style={styles.brandSub}>Your academic second brain</p>
        </div>

        <h1 style={styles.heading}>Log In</h1>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.forgotRow}>
            <Link to="/reset-password" style={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p style={styles.footer}>
          Need an account?{' '}
          <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F9F9F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    padding: '24px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    padding: '36px 32px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  brand: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  brandName: {
    fontSize: '26px',
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#863bff',
    letterSpacing: '-0.01em',
  },
  brandSub: {
    fontSize: '12px',
    color: '#AAA',
    margin: '4px 0 0',
  },
  heading: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: '20px',
    fontFamily: "'Inria Sans', sans-serif",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fieldGroup: {
    marginBottom: '12px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    color: '#888',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #E0E0E0',
    borderRadius: '7px',
    outline: 'none',
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
  },
  error: {
    fontSize: '12px',
    color: '#E53935',
    margin: '0 0 8px',
    padding: '8px 12px',
    backgroundColor: '#FFF0F0',
    borderRadius: '6px',
    border: '1px solid #FFCDD2',
  },
  forgotRow: {
    textAlign: 'right',
    marginBottom: '16px',
    marginTop: '2px',
  },
  forgotLink: {
    fontSize: '12px',
    color: '#863bff',
    textDecoration: 'none',
  },
  btn: {
    width: '100%',
    padding: '11px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#1A1A1A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '7px',
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    transition: 'background 0.15s',
  },
  footer: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#888',
    marginTop: '20px',
  },
  link: {
    color: '#863bff',
    textDecoration: 'none',
    fontWeight: '600',
  },
}

export default Login