import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function NewPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  function handleNewPassword(event) {
    event.preventDefault()

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    navigate('/')
  }

  return (
    <main style={{ padding: '32px', maxWidth: '420px', margin: '0 auto' }}>
      <h1>Set New Password</h1>
      <form onSubmit={handleNewPassword} style={{ display: 'grid', gap: '12px' }}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
        <button type="submit">Save Password</button>
      </form>
    </main>
  )
}

export default NewPassword
