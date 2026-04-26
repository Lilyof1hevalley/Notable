function NewPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  function handleNewPassword() {
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    navigate('/')
  }

  return (
    <div>
      <h1>Set New Password</h1>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleNewPassword}>Save Password</button>
    </div>
  )
}