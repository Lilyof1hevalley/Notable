function ResetPassword() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  function handleReset() {
    navigate('/')
  }

  return (
    <div>
      <h1>Reset Password</h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleReset}>Reset Password</button>
    </div>
  )
}