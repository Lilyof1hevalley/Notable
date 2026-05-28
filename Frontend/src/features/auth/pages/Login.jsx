import { useCallback, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../app/providers/AuthContext'
import GoogleAuthButton from '../components/GoogleAuthButton'
import { login, loginWithGoogle } from '../auth.api'

const styles = `

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    background-color: #f5f4f1;
    font-family: 'Inria Serif', Georgia, serif;
    color: #1a1a1a;
    display: flex;
    flex-direction: column;
  }

  /* ── Navbar ── */
  .login-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 32px;
    border-bottom: 1px solid #dddbd6;
  }
  .login-nav-brand {
    font-size: 1.15rem;
    font-style: italic;
    letter-spacing: -0.01em;
    text-decoration: none;
    color: #1a1a1a;
  }
  .login-nav-brand::after {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    background: #1a1a1a;
    border-radius: 50%;
    margin-left: 4px;
    vertical-align: middle;
    position: relative;
    top: -1px;
  }

  /* ── Main layout ── */
  .login-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
  }

  .login-panel {
    width: 100%;
    max-width: 420px;
  }

  .login-eyebrow {
    font-family: 'Geist Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 8px;
  }

  .login-heading {
    font-family: 'Inria Serif', Georgia, serif;
    font-size: 2rem;
    font-style: italic;
    font-weight: 400;
    line-height: 1.1;
    margin-bottom: 32px;
    color: #1a1a1a;
    letter-spacing: -0.02em;
  }

  /* ── Form ── */
  .login-field {
    margin-bottom: 18px;
  }
  .login-label {
    display: block;
    font-family: 'Geist Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 7px;
  }
  .login-input {
    width: 100%;
    padding: 10px 13px;
    background: #faf9f7;
    border: 1px solid #dddbd6;
    border-radius: 4px;
    font-family: 'Inria Serif', Georgia, serif;
    font-size: 1rem;
    color: #1a1a1a;
    outline: none;
    transition: border-color 0.15s;
  }
  .login-input::placeholder { color: #bbb; }
  .login-input:focus { border-color: #888; }

  .login-forgot {
    display: block;
    text-align: right;
    font-size: 0.82rem;
    font-style: italic;
    color: #999;
    text-decoration: none;
    margin-top: -10px;
    margin-bottom: 22px;
    transition: color 0.15s;
  }
  .login-forgot:hover { color: #333; }

  .login-error {
    font-family: 'Geist Mono', monospace;
    font-size: 0.68rem;
    color: #b94a4a;
    margin-bottom: 14px;
    letter-spacing: 0.02em;
  }

  .login-submit {
    width: 100%;
    padding: 11px 0;
    background: #1a1a1a;
    border: none;
    border-radius: 4px;
    font-family: 'Geist Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #f5f4f1;
    cursor: pointer;
    transition: background 0.15s;
  }
  .login-submit:hover:not(:disabled) { background: #333; }
  .login-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Footer ── */
  .login-footer {
    margin-top: 22px;
    font-size: 0.88rem;
    color: #999;
    text-align: center;
  }
  .login-footer a {
    color: #1a1a1a;
    text-decoration: none;
    border-bottom: 1px solid #c8c6c0;
    padding-bottom: 1px;
    transition: border-color 0.15s;
  }
  .login-footer a:hover { border-color: #1a1a1a; }
`

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Geist+Mono:wght@300;400&display=swap'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const redirectTo = location.state?.from?.pathname || '/dashboard'

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const data = await login({ email, password })
      auth.login(data.token, data.user)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = useCallback(async (credential) => {
    setError('')
    setIsSubmitting(true)
    try {
      const data = await loginWithGoogle(credential)
      auth.login(data.token, data.user)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }, [auth, navigate, redirectTo])

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        {/* Navbar */}
        <nav className="login-nav">
          <Link to="/" className="login-nav-brand">Notable</Link>
        </nav>

        {/* Main */}
        <main className="login-main">
          <div className="login-panel">
            <p className="login-eyebrow">Welcome back</p>
            <h1 className="login-heading">Log in to your account</h1>

            <GoogleAuthButton onError={setError} onSuccess={handleGoogleLogin} />

            {/* Form */}
            <form onSubmit={handleLogin}>
              <div className="login-field">
                <label className="login-label">Email</label>
                <input
                  type="email"
                  className="login-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="login-field">
                <label className="login-label">Password</label>
                <input
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Link to="/reset-password" className="login-forgot">Forgot password?</Link>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="login-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in…' : 'Login'}
              </button>
            </form>

            <p className="login-footer">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </main>
      </div>
    </>
  )
}

export default Login
