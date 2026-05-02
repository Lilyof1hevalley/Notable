import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function ResetPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  function handleReset(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.checkCircle}>✓</div>
            <h1 style={styles.title}>Check your<br />inbox</h1>
            <p style={styles.subtitle}>
              If <em>{email}</em> has an account, a reset link is on its way.
            </p>
          </div>
          <button style={styles.btn} onClick={() => navigate('/')}>BACK TO SIGN IN</button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Back button */}
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          ← Back to sign in
        </button>

        <div style={styles.header}>
          <h1 style={styles.title}>Password<br />Recovery</h1>
          <p style={styles.subtitle}>We'll send a reset link to your email</p>
        </div>

        <form onSubmit={handleReset} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="editor@notable.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.btn}>SEND RESET LINK</button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#EDEBE7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Georgia', serif",
    padding: 24,
  },
  card: {
    backgroundColor: '#F7F6F3',
    borderRadius: 18,
    padding: '44px 48px',
    width: '100%',
    maxWidth: 460,
    boxShadow: '0 12px 48px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.05)',
    position: 'relative',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Georgia', serif",
    fontStyle: 'italic',
    fontSize: 14,
    color: '#aaa',
    padding: 0,
    marginBottom: 28,
    display: 'block',
    letterSpacing: '0.01em',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  checkCircle: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    fontWeight: 700,
    margin: '0 auto 20px',
  },
  title: {
    fontFamily: "'Georgia', serif",
    fontStyle: 'italic',
    fontSize: 40,
    fontWeight: 400,
    color: '#1a1a1a',
    lineHeight: 1.18,
    margin: '0 0 14px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontFamily: "'Georgia', serif",
    fontStyle: 'italic',
    fontSize: 15,
    color: '#aaa',
    margin: 0,
    lineHeight: 1.6,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 9,
  },
  label: {
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: '#666',
  },
  input: {
    padding: '14px 16px',
    backgroundColor: '#EDEBE7',
    border: '1.5px solid transparent',
    borderRadius: 8,
    fontSize: 15,
    color: '#1a1a1a',
    outline: 'none',
    fontFamily: "'Georgia', serif",
    letterSpacing: '0.02em',
    width: '100%',
    boxSizing: 'border-box',
  },
  btn: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '16px 0',
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    letterSpacing: '0.14em',
    cursor: 'pointer',
    marginTop: 8,
    width: '100%',
  },
}

export default ResetPassword