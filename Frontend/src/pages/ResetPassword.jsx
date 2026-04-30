import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ResetPassword() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  function handleReset(event) {
    event.preventDefault()
    navigate('/')
  }

  return (
    <main style={{ padding: '32px', maxWidth: '420px', margin: '0 auto' }}>
      <h1>Reset Password</h1>
      <form onSubmit={handleReset} style={{ display: 'grid', gap: '12px' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </main>
  )
}

export default ResetPassword
