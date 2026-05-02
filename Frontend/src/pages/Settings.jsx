import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { useAuth } from '../lib/AuthContext'

function Settings() {
  const auth = useAuth()
  const [profileForm, setProfileForm] = useState({ name: '', display_name: '', gcal_url: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await apiRequest('/user/profile')
        const user = profileData.user
        setProfileForm({ 
          name: user.name || '', 
          display_name: user.display_name || '',
          gcal_url: user.gcal_url || '' // Assuming gcal_url can be saved in profile
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [])

  async function submitSettings(event) {
    event.preventDefault()
    setMessage('')
    try {
      await apiRequest('/user/profile', {
        method: 'PATCH',
        body: JSON.stringify(profileForm),
      })
      setMessage('Profile updated.')
      auth.updateUser({ ...auth.user, ...profileForm })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to="/dashboard" className="back-link" style={{ fontSize: '12px', marginBottom: '4px', color: '#68768d' }}>← Back to dashboard</Link>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1A303A' }}>Settings</h1>
          </div>
        </div>
      </header>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      {isLoading ? (
        <div className="panel">Loading profile...</div>
      ) : (
        <section className="panel main-panel">
          <form className="stack" onSubmit={submitSettings}>
            <label className="auth-form-label">
              Full Name
              <input className="auth-form-input" style={{ marginTop: '8px' }} value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} required />
            </label>
            <label className="auth-form-label">
              Display Name
              <input className="auth-form-input" style={{ marginTop: '8px' }} value={profileForm.display_name} onChange={(event) => setProfileForm({ ...profileForm, display_name: event.target.value })} />
            </label>
            <label className="auth-form-label">
              Google Calendar Public Embed URL
              <input className="auth-form-input" style={{ marginTop: '8px', marginBottom: '4px' }} value={profileForm.gcal_url} onChange={(event) => setProfileForm({ ...profileForm, gcal_url: event.target.value })} placeholder="https://calendar.google.com/calendar/embed?src=..." />
              <span className="muted" style={{ fontSize: '12px', fontWeight: '400' }}>Paste the embed URL from your Google Calendar settings to view it in Your Day.</span>
            </label>
            <button type="submit" className="auth-submit-btn" style={{ marginTop: '16px' }}>Save Settings</button>
          </form>
        </section>
      )}
    </main>
  )
}

export default Settings
