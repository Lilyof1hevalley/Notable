import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailFocus, setEmailFocus] = useState(false)
  const [passFocus, setPassFocus] = useState(false)
  const navigate = useNavigate()

  function handleLogin(e) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome to<br />Notable</h1>
          <p style={styles.subtitle}>Journal your thoughts elegantly</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="editor@notable.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              required
              style={{ ...styles.input, borderColor: emailFocus ? '#1a1a1a' : 'transparent' }}
            />
          </div>

          <div style={styles.field}>
            <div style={styles.passwordHeader}>
              <label style={styles.label}>PASSWORD</label>
              <Link to="/reset-password" style={styles.recovery}>RECOVERY</Link>
            </div>
            <input
              type="password"
              placeholder="········"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setPassFocus(true)}
              onBlur={() => setPassFocus(false)}
              required
              style={{ ...styles.input, borderColor: passFocus ? '#1a1a1a' : 'transparent' }}
            />
          </div>

          <button type="submit" style={styles.btn}>SIGN IN</button>
        </form>

        <p style={styles.footer}>
          New here?{' '}
          <Link to="/register" style={styles.footerLink}>Create an account</Link>
        </p>
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
    fontFamily: "'Georgia', 'Times New Roman', serif",
    padding: 24,
  },
  card: {
    backgroundColor: '#F7F6F3',
    borderRadius: 18,
    padding: '52px 48px 44px',
    width: '100%',
    maxWidth: 460,
    boxShadow: '0 12px 48px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 44,
  },
  title: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
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
    letterSpacing: '0.01em',
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
  passwordHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recovery: {
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: '#bbb',
    textDecoration: 'none',
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
    transition: 'border-color 0.15s',
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
  footer: {
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 0,
    fontFamily: "'Georgia', serif",
    fontStyle: 'italic',
    fontSize: 14,
    color: '#aaa',
  },
  footerLink: {
    color: '#555',
    textDecoration: 'underline',
    textUnderlineOffset: 3,
    fontStyle: 'italic',
  },
}

export default Login