import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleLogin(event) {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <main style={{ padding: '32px', maxWidth: '420px', margin: '0 auto' }}>
      <h1>Log In</h1>
      <form onSubmit={handleLogin} style={{ display: 'grid', gap: '12px' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Need an account? <Link to="/register">Register</Link>
      </p>
    </main>
  )
}

export default Login
