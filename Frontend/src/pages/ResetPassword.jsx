import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../lib/api'

function ResetPassword() {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleReset(event) {
    event.preventDefault()
    setError('')
    setResult(null)
    setIsSubmitting(true)
    try {
      const data = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
      <h1>Reset Password</h1>
      <p className="muted">Untuk lokal, token reset akan tampil langsung jika email terdaftar.</p>
      <form onSubmit={handleReset} className="stack">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Generating...' : 'Reset Password'}
        </button>
      </form>
      {result && (
        <div className="notice">
          <strong>{result.message}</strong>
          {result.resetToken && <code>{result.resetToken}</code>}
          {result.resetLink && <Link to={`/new-password?token=${result.resetToken}`}>Open reset form</Link>}
        </div>
      )}
      <p><Link to="/">Back to login</Link></p>
      </section>
    </main>
  )
}

export default ResetPassword
