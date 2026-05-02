import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function NewPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    navigate('/')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          ← Back to sign in
        </button>

        <div style={styles.header}>
          <h1 style={styles.title}>New<br />Password</h1>
          <p style={styles.subtitle}>This will override your old password</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>PASSWORD</label>
            <input
              type="password"
              placeholder="········"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>CONFIRM PASSWORD</label>
            <input
              type="password"
              placeholder="········"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.btn}>CHANGE PASSWORD</button>
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
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: "'Georgia', serif",
    fontStyle: 'italic',
    fontSize: 44,
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
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    color: '#DC2626',
    marginBottom: 20,
    fontFamily: "'Inter', sans-serif",
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

export default NewPassword