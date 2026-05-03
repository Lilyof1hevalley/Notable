import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import Notebook from './pages/Notebook'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import NewPassword from './pages/NewPassword'
import Settings from './pages/Settings'
import EditChapter from './pages/EditChapter'
import FolderDetail from './pages/FolderDetail'
import { AuthProvider, ProtectedRoute } from './lib/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/notebook" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/notebook/:id"
            element={(
              <ProtectedRoute>
                <Notebook />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/notebook/:notebookId/chapter/:chapterId/edit"
            element={(
              <ProtectedRoute>
                <EditChapter />
              </ProtectedRoute>
            )}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route
            path="/folder/:id"
            element={(
              <ProtectedRoute>
                <FolderDetail />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/settings"
            element={(
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
