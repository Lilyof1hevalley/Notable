import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { useAuth } from '../lib/AuthContext'
import Navbar from '../components/Navbar'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      auth.login(data.token, data.user)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <Navbar />
      <main className="auth-content">
        <h1 className="auth-title">Log In</h1>
        <section className="auth-card">
          <div className="auth-card-title">Login to your Account</div>
          <div className="auth-card-subtitle">Enter your email and password</div>
          <form onSubmit={handleLogin}>
            <div>
              <label className="auth-form-label">Email</label>
              <input
                type="email"
                className="auth-form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="auth-form-label">Password</label>
              <input
                type="password"
                className="auth-form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <Link to="/reset-password" className="forgot-password-link">Forgot Password?</Link>
            
            {error && <div className="error">{error}</div>}
            
            <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="auth-divider">Or</div>
          
          <button type="button" className="google-btn">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
            Continue with Google
          </button>
          
          <div className="auth-footer-text">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Login
