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

function ResetPassword() {
  const [email, setEmail] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)
  const navigate = useNavigate()

  function handleReset(event) {
    event.preventDefault()
    navigate('/')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Reset your<br />Password</h1>
        <p style={styles.subtitle}>We'll send a recovery link to your email</p>

        <form onSubmit={handleReset}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="editor@notable.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              required
              style={{
                ...styles.input,
                borderColor: emailFocused ? '#1A1A1A' : 'transparent',
              }}
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
            Send Recovery Link
          </button>
        </form>

        <p style={styles.footer}>
          Remember your password?{' '}
          <Link to="/" style={styles.footerLink}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword