import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#E8E4DC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
    padding: '24px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '56px 48px 48px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 2px 24px rgba(0,0,0,0.07)',
  },
  heading: {
    fontFamily: "'Inria Sans', serif",
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '42px',
    lineHeight: '1.15',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    fontFamily: "'Inria Sans', serif",
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '15px',
    color: '#888',
    textAlign: 'center',
    marginBottom: '40px',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: '#1A1A1A',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    fontSize: '15px',
    color: '#1A1A1A',
    backgroundColor: '#F5F4F1',
    border: '1.5px solid transparent',
    borderRadius: '10px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.15s',
  },
  button: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#1A1A1A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    marginTop: '8px',
    fontFamily: "'Inter', sans-serif",
    transition: 'background-color 0.15s',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '13px',
    color: '#888',
  },
  footerLink: {
    color: '#1A1A1A',
    fontWeight: '600',
    textDecoration: 'none',
  },
}

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [focused, setFocused] = useState(null)
  const [btnHovered, setBtnHovered] = useState(false)
  const navigate = useNavigate()

  function handleRegister(event) {
    event.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    navigate('/dashboard')
  }

  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: focused === field ? '#1A1A1A' : 'transparent',
  })

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Create an<br />Account</h1>
        <p style={styles.subtitle}>Start journaling your thoughts elegantly</p>

        <form onSubmit={handleRegister}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="editor@notable.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              required
              style={inputStyle('email')}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="········"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              required
              style={inputStyle('password')}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="········"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocused('confirm')}
              onBlur={() => setFocused(null)}
              required
              style={inputStyle('confirm')}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: btnHovered ? '#333' : '#1A1A1A',
            }}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
          >
            Create Account
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/" style={styles.footerLink}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default Register