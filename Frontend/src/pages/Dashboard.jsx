import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { useAuth } from '../lib/AuthContext'
import FolderCard from '../components/FolderCard'
import NotebookCard from '../components/NotebookCard'

const emptyTodo = {
  title: '',
  deadline: '',
  academic_weight: '5',
  estimated_effort: '3',
}

function formatDate(value) {
  if (!value) return 'No deadline'
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function Dashboard() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(auth.user)
  const [folders, setFolders] = useState([])
  const [notebooks, setNotebooks] = useState([])
  const [todos, setTodos] = useState([])
  const [recommendedTodos, setRecommendedTodos] = useState([])
  const [sessions, setSessions] = useState([])
  const [folderTitle, setFolderTitle] = useState('')
  const [notebookTitle, setNotebookTitle] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('')
  const [todoForm, setTodoForm] = useState(emptyTodo)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // UI States
  const [isTimerMinimized, setIsTimerMinimized] = useState(false)
  const [showGcalModal, setShowGcalModal] = useState(false)

  async function loadDashboard() {
    setError('')
    try {
      const [profileData, foldersData, notebooksData, todosData, recommendedData, sessionsData] = await Promise.all([
        apiRequest('/user/profile'),
        apiRequest('/folders'),
        apiRequest('/notebooks'),
        apiRequest('/todos?limit=100'),
        apiRequest('/focus-sessions/recommended'),
        apiRequest('/focus-sessions'),
      ])
      setProfile(profileData.user)
      auth.updateUser(profileData.user)
      setFolders(foldersData.folders || [])
      setNotebooks(notebooksData.notebooks || [])
      setTodos(todosData.todos || [])
      setRecommendedTodos(recommendedData.recommended_todos || [])
      setSessions(sessionsData.sessions || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDashboard()
    }, 0)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeSession = sessions.find((session) => session.is_completed === 0)

  async function submitFolder(event) {
    event.preventDefault()
    setMessage('')
    try {
      await apiRequest('/folders', {
        method: 'POST',
        body: JSON.stringify({ title: folderTitle }),
      })
      setFolderTitle('')
      setMessage('Folder created.')
      await loadDashboard()
    } catch (err) {
      setError(err.message)
    }
  }

  async function submitNotebook(event) {
    event.preventDefault()
    setMessage('')
    try {
      await apiRequest('/notebooks', {
        method: 'POST',
        body: JSON.stringify({ title: notebookTitle, folder_id: selectedFolder || null }),
      })
      setNotebookTitle('')
      setSelectedFolder('')
      setMessage('Notebook created.')
      await loadDashboard()
    } catch (err) {
      setError(err.message)
    }
  }

  async function submitTodo(event) {
    event.preventDefault()
    setMessage('')
    try {
      await apiRequest('/todos', {
        method: 'POST',
        body: JSON.stringify({
          title: todoForm.title,
          deadline: todoForm.deadline,
          academic_weight: Number(todoForm.academic_weight),
          estimated_effort: Number(todoForm.estimated_effort),
        }),
      })
      setTodoForm(emptyTodo)
      setMessage('Todo created.')
      await loadDashboard()
    } catch (err) {
      setError(err.message)
    }
  }

  async function completeTodo(todoId) {
    setMessage('')
    try {
      await apiRequest(`/todos/${todoId}/complete`, { method: 'PATCH' })
      setMessage('Todo completed.')
      await loadDashboard()
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteTodo(todoId) {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    setMessage('')
    try {
      await apiRequest(`/todos/${todoId}`, { method: 'DELETE' })
      setMessage('Todo deleted.')
      await loadDashboard()
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteNotebook(notebookId) {
    if (!window.confirm('Are you sure you want to delete this notebook?')) return
    setMessage('')
    try {
      await apiRequest(`/notebooks/${notebookId}`, { method: 'DELETE' })
      setMessage('Notebook deleted.')
      await loadDashboard()
    } catch (err) {
      setError(err.message)
    }
  }

  async function startFocus(todoId) {
    setMessage('')
    try {
      await apiRequest('/focus-sessions', {
        method: 'POST',
        body: JSON.stringify({ duration_minutes: 50, todo_ids: todoId ? [todoId] : [] }),
      })
      setMessage('Focus session started.')
      await loadDashboard()
    } catch (err) {
      setError(err.message)
    }
  }

  async function endFocus(sessionId) {
    setMessage('')
    try {
      await apiRequest(`/focus-sessions/${sessionId}/end`, { method: 'PATCH' })
      setMessage('Focus session ended.')
      setIsTimerMinimized(false)
      await loadDashboard()
    } catch (err) {
      setError(err.message)
    }
  }

  function logout() {
    auth.logout()
    navigate('/', { replace: true })
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Hello, {profile?.display_name || profile?.name || 'Student'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/settings" className="ghost-button" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Settings</Link>
          <button type="button" className="ghost-button" onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      
      {isLoading ? (
        <div className="panel">Loading workspace...</div>
      ) : (
        <div className="dashboard-grid">
          <section className="panel wide" style={{ gridRow: 'span 2' }}>
            <div className="section-heading">
              <h2>Workspace</h2>
              <span>{folders.length} Folders · {notebooks.length} Notebooks</span>
            </div>
            <div className="card-grid">
              {folders.map((folder) => (
                <div key={folder.id} className="card-wrapper">
                  <Link to={`#`} style={{ textDecoration: 'none' }}>
                    <FolderCard title={folder.title} taskCount={0} />
                  </Link>
                </div>
              ))}
              {notebooks.map((notebook) => (
                <div key={notebook.id} style={{ position: 'relative', marginTop: '12px' }}>
                  <Link to={`/notebook/${notebook.id}`} style={{ textDecoration: 'none' }}>
                    <NotebookCard title={notebook.title} taskCount={0} />
                  </Link>
                  <button 
                    className="icon-button" 
                    style={{ position: 'absolute', top: 8, right: 8, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} 
                    onClick={() => deleteNotebook(notebook.id)}
                    title="Delete Notebook"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              {folders.length === 0 && notebooks.length === 0 && <p className="muted">Create a folder or notebook to start.</p>}
            </div>
          </section>

          <aside className="panel" style={{ gridRow: 'span 2' }}>
            <div className="section-heading">
              <h2>Your Day</h2>
              <button className="ghost-button" onClick={() => setShowGcalModal(true)}>Full Screen</button>
            </div>
            <div style={{ height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
              {profile?.gcal_url ? (
                <iframe src={profile.gcal_url} className="gcal-iframe" title="Google Calendar" />
              ) : (
                <div className="compact-list">
                  <div className="task-row" style={{ background: '#fbfcfe', border: '1px solid #e1e6ef', borderRadius: 8 }}>
                    <div style={{ width: 12, height: 12, background: '#5d6b82', borderRadius: '4px' }}></div>
                    <div>
                      <strong>All-Day Event</strong>
                      <p>Location</p>
                    </div>
                  </div>
                  <div className="task-row" style={{ background: '#fbfcfe', border: '1px solid #e1e6ef', borderRadius: 8 }}>
                    <div style={{ width: 12, height: 12, background: '#5d6b82', borderRadius: '4px' }}></div>
                    <div>
                      <strong>Event Name</strong>
                      <p>08:00 - 09:00 · Location</p>
                    </div>
                  </div>
                  <div className="task-row" style={{ background: '#fbfcfe', border: '1px solid #e1e6ef', borderRadius: 8 }}>
                    <div style={{ width: 12, height: 12, background: '#5d6b82', borderRadius: '4px' }}></div>
                    <div>
                      <strong>Event Name</strong>
                      <p>10:00 - 11:30 · Location</p>
                    </div>
                  </div>
                  <p className="muted" style={{ marginTop: '16px', fontSize: '13px' }}>
                    Update your settings to embed your real Google Calendar.
                  </p>
                </div>
              )}
            </div>
          </aside>

          <aside className="panel">
            <h2>Focus Session</h2>
            {activeSession ? (
              <div className="stack">
                <p>Active {activeSession.duration_minutes}-minute session started at {new Date(activeSession.started_at).toLocaleTimeString()}.</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => endFocus(activeSession.id)} style={{ flex: 1 }}>End Session</button>
                  <button type="button" className="ghost-button" onClick={() => setIsTimerMinimized(true)}>Minimize</button>
                </div>
              </div>
            ) : (
              <div className="stack">
                <p className="muted">Start with your highest BHPS recommendation.</p>
                <button type="button" onClick={() => startFocus(recommendedTodos[0]?.id)} disabled={recommendedTodos.length === 0}>Start 50-min Focus</button>
              </div>
            )}
            <div className="compact-list" style={{ marginTop: '12px' }}>
              {recommendedTodos.slice(0, 3).map((todo) => (
                <div key={todo.id}>
                  <strong>{todo.title}</strong>
                  <span>{todo.priority_label} · {todo.bhps_score}</span>
                </div>
              ))}
            </div>
          </aside>

          <section className="panel wide">
            <div className="section-heading">
              <h2>Priority Queue</h2>
              <span>BHPS ranked</span>
            </div>
            <div className="task-list">
              {todos.map((todo) => (
                <article key={todo.id} className="task-row">
                  <button type="button" className="check-button" onClick={() => completeTodo(todo.id)} disabled={Boolean(todo.is_completed)}>
                    {todo.is_completed ? 'Done' : 'Complete'}
                  </button>
                  <div style={{ flex: 1 }}>
                    <strong>{todo.title}</strong>
                    <p>{formatDate(todo.deadline)} · weight {todo.academic_weight} · effort {todo.estimated_effort}</p>
                  </div>
                  <span className={`priority ${String(todo.priority_label || 'low').toLowerCase()}`}>
                    {todo.priority_label || 'LOW'} · {todo.bhps_score ?? 0}
                  </span>
                  <button type="button" className="icon-button" onClick={() => deleteTodo(todo.id)} title="Delete Task">🗑️</button>
                </article>
              ))}
              {todos.length === 0 && <p className="muted">No todos yet.</p>}
            </div>
          </section>

          <section className="panel">
            <h2>Create Folder</h2>
            <form className="stack" onSubmit={submitFolder}>
              <input value={folderTitle} onChange={(event) => setFolderTitle(event.target.value)} placeholder="Folder title" required />
              <button type="submit">Create Folder</button>
            </form>
          </section>

          <section className="panel">
            <h2>Create Notebook</h2>
            <form className="stack" onSubmit={submitNotebook}>
              <input value={notebookTitle} onChange={(event) => setNotebookTitle(event.target.value)} placeholder="Notebook title" required />
              <select value={selectedFolder} onChange={(event) => setSelectedFolder(event.target.value)}>
                <option value="">No folder</option>
                {folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.title}</option>)}
              </select>
              <button type="submit">Create Notebook</button>
            </form>
          </section>

          <section className="panel wide">
            <h2>Create Todo</h2>
            <form className="todo-form" onSubmit={submitTodo}>
              <input value={todoForm.title} onChange={(event) => setTodoForm({ ...todoForm, title: event.target.value })} placeholder="Task title" required />
              <input value={todoForm.deadline} onChange={(event) => setTodoForm({ ...todoForm, deadline: event.target.value })} placeholder="YYYY-MM-DD" required />
              <label>
                Weight
                <input type="number" min="1" max="10" value={todoForm.academic_weight} onChange={(event) => setTodoForm({ ...todoForm, academic_weight: event.target.value })} required />
              </label>
              <label>
                Effort
                <input type="number" min="1" max="10" value={todoForm.estimated_effort} onChange={(event) => setTodoForm({ ...todoForm, estimated_effort: event.target.value })} required />
              </label>
              <button type="submit">Create Todo</button>
            </form>
          </section>

        </div>
      )}

      {/* Floating Timer Pop-up */}
      {isTimerMinimized && activeSession && (
        <div className="floating-timer">
          <div className="header">
            <strong>Focus Session</strong>
            <button className="icon-button" onClick={() => setIsTimerMinimized(false)}>↗️</button>
          </div>
          <p style={{ fontSize: '14px', marginBottom: '12px' }}>{activeSession.duration_minutes}m session running...</p>
          <button style={{ width: '100%' }} onClick={() => endFocus(activeSession.id)}>End Session</button>
        </div>
      )}

      {/* Full-screen GCal Modal */}
      {showGcalModal && (
        <div className="modal-overlay" onClick={() => setShowGcalModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Your Day - Google Calendar</h2>
              <button className="icon-button" onClick={() => setShowGcalModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {profile?.gcal_url ? (
                <iframe src={profile.gcal_url} className="gcal-iframe" title="Google Calendar Fullscreen" />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p className="muted">No Google Calendar URL configured.</p>
                  <Link to="/settings" onClick={() => setShowGcalModal(false)}><button style={{ marginTop: '16px' }}>Go to Settings</button></Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Dashboard
