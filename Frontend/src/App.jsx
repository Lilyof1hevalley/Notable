import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Notebook from './pages/Notebook'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import NewPassword from './pages/NewPassword'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/notebook" element={<Notebook />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App