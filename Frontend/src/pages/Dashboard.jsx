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
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [showCreateNotebookModal, setShowCreateNotebookModal] = useState(false)
  const [showCreateTodoModal, setShowCreateTodoModal] = useState(false)

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
      setShowCreateFolderModal(false)
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
      setShowCreateNotebookModal(false)
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
      setShowCreateTodoModal(false)
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
      <header className="topbar pill">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <h1 style={{ fontFamily: '"Inria Sans", sans-serif', fontStyle: 'italic', color: '#3a4658' }}>
            Hello, {profile?.display_name || profile?.name || 'Student'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="search-box" style={{ background: '#cfd6e4', borderRadius: '999px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>🔍</span>
            <input placeholder="Search" style={{ background: 'transparent', border: 'none', padding: 0, outline: 'none', color: '#18202f' }} />
          </div>
          <button className="icon-button" title="Filter">⏳</button>
          <button className="icon-button" title="Sort">🔃</button>
          <Link to="/settings" className="icon-button" title="Settings" style={{ textDecoration: 'none' }}>⚙️</Link>
          <button className="icon-button" onClick={logout} title="Logout">🚪</button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      {isLoading ? (
        <div className="panel">Loading workspace...</div>
      ) : (
        <div className="dashboard-grid">
          {/* Main Grid Area (Left) */}
          <section className="card-grid" style={{ alignContent: 'start' }}>
            {folders.map((folder) => (
              <div key={folder.id} style={{ height: '100%' }}>
                <Link to={`#`} style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
                  <FolderCard title={folder.title} taskCount={0} />
                </Link>
              </div>
            ))}
            {notebooks.map((notebook) => (
              <div key={notebook.id} style={{ position: 'relative', marginTop: '12px', height: '100%' }}>
                <Link to={`/notebook/${notebook.id}`} style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
                  <NotebookCard title={notebook.title} taskCount={0} />
                </Link>
                <button 
                  className="icon-button" 
                  style={{ position: 'absolute', top: 8, right: 8, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '4px' }} 
                  onClick={() => deleteNotebook(notebook.id)}
                  title="Delete Notebook"
                >
                  🗑️
                </button>
              </div>
            ))}
            <div style={{ marginTop: '12px', height: '100%' }}>
              <div 
                className="add-card-button" 
                onClick={() => {
                  const choice = window.prompt("Type 'folder' to create a folder or 'notebook' to create a notebook:");
                  if (choice === 'folder') setShowCreateFolderModal(true);
                  if (choice === 'notebook') setShowCreateNotebookModal(true);
                }}
              >
                +
              </div>
            </div>
          </section>

          {/* Right Sidebar */}
          <div style={{ display: 'grid', gap: '24px', alignContent: 'start' }}>
            {/* Your Day Panel */}
            <aside className="panel" style={{ padding: '0', overflow: 'hidden' }}>
              <div className="section-heading" style={{ background: '#e1e6ef', padding: '16px 20px', margin: 0, borderRadius: '8px 8px 0 0' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontFamily: '"Inria Sans", sans-serif', fontStyle: 'italic', color: '#5d6b82' }}>Your <span style={{ fontWeight: 400 }}>Day</span></h2>
                <button className="ghost-button" onClick={() => setShowGcalModal(true)} style={{ padding: '4px 8px', fontSize: '12px' }}>Full Screen</button>
              </div>
              <div style={{ padding: '16px', background: '#fbfcfe' }}>
                {profile?.gcal_url ? (
                  <iframe src={profile.gcal_url} className="gcal-iframe" style={{ height: '300px' }} title="Google Calendar" />
                ) : (
                  <div className="compact-list">
                    <div className="task-row" style={{ background: '#fff', border: '1px solid #e1e6ef', borderRadius: '8px' }}>
                      <div style={{ width: 16, height: 16, background: '#5d6b82', borderRadius: '4px' }}></div>
                      <div>
                        <strong style={{ fontSize: '14px' }}>All-Day Event</strong>
                        <p style={{ margin: 0, fontSize: '12px' }}>Location</p>
                      </div>
                    </div>
                    <div className="task-row" style={{ background: '#fff', border: '1px solid #e1e6ef', borderRadius: '8px' }}>
                      <div style={{ width: 16, height: 16, background: '#5d6b82', borderRadius: '4px' }}></div>
                      <div>
                        <strong style={{ fontSize: '14px' }}>Event Name</strong>
                        <p style={{ margin: 0, fontSize: '12px' }}>08:00 - 09:00 · Location</p>
                      </div>
                    </div>
                    <p className="muted" style={{ marginTop: '16px', fontSize: '13px' }}>
                      Update settings to embed your real Google Calendar.
                    </p>
                  </div>
                )}
              </div>
            </aside>

            {/* Timeline Panel */}
            <aside className="panel" style={{ padding: '0', overflow: 'hidden' }}>
              <div className="section-heading" style={{ background: '#e1e6ef', padding: '16px 20px', margin: 0, borderRadius: '8px 8px 0 0' }}>
                <h2 style={{ margin: 0, fontSize: '18px' }}>Timeline</h2>
                <button className="icon-button" onClick={() => setShowCreateTodoModal(true)} style={{ padding: '2px', color: '#18202f', fontWeight: 'bold' }}>➕</button>
              </div>
              <div style={{ padding: '16px', background: '#e1e6ef' }}>
                <div className="stack" style={{ gap: '12px' }}>
                  {todos.map((todo) => (
                    <article key={todo.id} style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '12px', borderRadius: '8px', gap: '12px' }}>
                      <button 
                        type="button" 
                        onClick={() => completeTodo(todo.id)} 
                        style={{ background: 'transparent', border: '2px solid #aeb8c9', borderRadius: '50%', width: '20px', height: '20px', padding: 0, cursor: 'pointer' }}
                        title="Mark Complete"
                      ></button>
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '14px', display: 'block' }}>{todo.title}</strong>
                        <p style={{ margin: 0, fontSize: '12px', color: '#68768d' }}>{todo.deadline ? new Date(todo.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All day'} · Folder/Notebook</p>
                      </div>
                      <button type="button" className="icon-button" onClick={() => deleteTodo(todo.id)} style={{ padding: '4px' }} title="Delete Task">🗑️</button>
                    </article>
                  ))}
                  {todos.length === 0 && <p className="muted">No todos yet.</p>}
                </div>
              </div>
            </aside>

            {/* Focus Session Panel */}
            <aside className="panel">
              <h2 style={{ fontSize: '18px' }}>Focus Session</h2>
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
                  <p className="muted" style={{ fontSize: '14px' }}>Start with your highest priority task.</p>
                  <button type="button" onClick={() => startFocus(recommendedTodos[0]?.id)} disabled={recommendedTodos.length === 0}>Start 50-min Focus</button>
                </div>
              )}
            </aside>
          </div>
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

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="modal-overlay" onClick={() => setShowCreateFolderModal(false)}>
          <div className="modal-content" style={{ height: 'auto', maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Folder</h2>
              <button className="icon-button" onClick={() => setShowCreateFolderModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form className="stack" onSubmit={submitFolder}>
                <input value={folderTitle} onChange={(event) => setFolderTitle(event.target.value)} placeholder="Folder title" required />
                <button type="submit">Create</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Notebook Modal */}
      {showCreateNotebookModal && (
        <div className="modal-overlay" onClick={() => setShowCreateNotebookModal(false)}>
          <div className="modal-content" style={{ height: 'auto', maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Notebook</h2>
              <button className="icon-button" onClick={() => setShowCreateNotebookModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form className="stack" onSubmit={submitNotebook}>
                <input value={notebookTitle} onChange={(event) => setNotebookTitle(event.target.value)} placeholder="Notebook title" required />
                <select value={selectedFolder} onChange={(event) => setSelectedFolder(event.target.value)}>
                  <option value="">No folder</option>
                  {folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.title}</option>)}
                </select>
                <button type="submit">Create</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Todo Modal */}
      {showCreateTodoModal && (
        <div className="modal-overlay" onClick={() => setShowCreateTodoModal(false)}>
          <div className="modal-content" style={{ height: 'auto', maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Todo</h2>
              <button className="icon-button" onClick={() => setShowCreateTodoModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form className="stack" onSubmit={submitTodo}>
                <input value={todoForm.title} onChange={(event) => setTodoForm({ ...todoForm, title: event.target.value })} placeholder="Task title" required />
                <input value={todoForm.deadline} onChange={(event) => setTodoForm({ ...todoForm, deadline: event.target.value })} placeholder="YYYY-MM-DD" required />
                <label>
                  Weight (1-10)
                  <input type="number" min="1" max="10" value={todoForm.academic_weight} onChange={(event) => setTodoForm({ ...todoForm, academic_weight: event.target.value })} required />
                </label>
                <label>
                  Effort (1-10)
                  <input type="number" min="1" max="10" value={todoForm.estimated_effort} onChange={(event) => setTodoForm({ ...todoForm, estimated_effort: event.target.value })} required />
                </label>
                <button type="submit">Create Task</button>
              </form>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}

export default Dashboard
