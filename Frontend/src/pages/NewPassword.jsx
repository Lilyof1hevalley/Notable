import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const API_BASE = 'http://localhost:3000/api'

function NewPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  async function handleNewPassword(event) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (!token) {
      setError('Invalid or missing reset token. Please request a new reset link.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Password reset failed. Please try again.')
      } else {
        setSuccess(true)
        setTimeout(() => navigate('/'), 2000)
      }
    } catch {
      setError('Unable to connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/register" style={styles.navLink}>Register</Link>
        <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
      </nav>

      <div style={styles.content}>
        <h1 style={styles.heading}>New Password</h1>

        <div style={styles.card}>
          {success ? (
            <div style={styles.successBox}>
              <div style={styles.successIcon}>✓</div>
              <h2 style={styles.successTitle}>Password updated!</h2>
              <p style={styles.successText}>Your password has been changed. Redirecting you to login...</p>
            </div>
          ) : (
            <>
              <h2 style={styles.cardTitle}>Create Your New Password</h2>
              <p style={styles.cardSubtitle}>This will override your old password</p>

              {error && <div style={styles.errorBox}>{error}</div>}

              <form onSubmit={handleNewPassword} style={styles.form}>
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
                </div>

                <div style={styles.field}>
                  <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <button type="submit" style={styles.btn} disabled={loading}>
                  {loading ? 'Saving...' : 'Change Password'}
                </button>
              </form>
            </>
          )}
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
  },
  successBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 12,
  },
  successIcon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: '#D1FAE5',
    color: '#059669',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    fontWeight: 700,
  },
  successTitle: {
    fontFamily: "'Inria Sans', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: '#0D1B2A',
    margin: 0,
  },
  successText: {
    fontSize: 14,
    color: '#6B7280',
    margin: 0,
  },
}

export default NewPassword