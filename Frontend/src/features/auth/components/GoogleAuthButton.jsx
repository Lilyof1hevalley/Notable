import { useEffect, useRef, useState } from 'react'

const GOOGLE_SCRIPT_ID = 'google-identity-services'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function loadGoogleScript() {
  const existing = document.getElementById(GOOGLE_SCRIPT_ID)
  if (existing) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function GoogleAuthButton({ label = 'continue_with', onError, onSuccess }) {
  const buttonRef = useRef(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return undefined

    let isActive = true
    loadGoogleScript()
      .then(() => {
        if (!isActive || !window.google?.accounts?.id || !buttonRef.current) return

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback(response) {
            if (response?.credential) {
              onSuccess(response.credential)
            } else {
              onError?.('Google did not return a credential.')
            }
          },
        })
        window.google.accounts.id.renderButton(buttonRef.current, {
          logo_alignment: 'left',
          shape: 'rectangular',
          size: 'large',
          text: label,
          theme: 'outline',
          width: 420,
        })
        setIsReady(true)
      })
      .catch(() => {
        if (isActive) onError?.('Unable to load Google sign-in.')
      })

    return () => {
      isActive = false
    }
  }, [label, onError, onSuccess])

  if (!GOOGLE_CLIENT_ID) return null

  return (
    <div className={isReady ? 'google-auth-area is-ready' : 'google-auth-area'}>
      <div ref={buttonRef} />
      <div className="auth-divider">
        <span />
        <strong>or</strong>
        <span />
      </div>
    </div>
  )
}

export default GoogleAuthButton
