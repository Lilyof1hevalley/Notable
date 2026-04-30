import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import NewPassword from './pages/NewPassword'
import Dashboard from './pages/Dashboard'
import Notebook from './pages/Notebook'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notebook/:id" element={<Notebook />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
