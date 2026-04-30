import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  function handleRegister(event) {
    event.preventDefault()

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    navigate('/dashboard')
  }

  return (
    <main style={{ padding: '32px', maxWidth: '420px', margin: '0 auto' }}>
      <h1>Register</h1>
      <form onSubmit={handleRegister} style={{ display: 'grid', gap: '12px' }}>
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
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/">Log in</Link>
      </p>
    </main>
  )
}

export default Register
