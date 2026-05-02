import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { useAuth } from '../lib/AuthContext'

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
      setFolders(foldersData.folders)
      setNotebooks(notebooksData.notebooks)
      setTodos(todosData.todos)
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

  const upcomingTodos = useMemo(() => (
    [...todos]
      .filter((todo) => !todo.is_completed)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 6)
  ), [todos])

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
        <button type="button" className="ghost-button" onClick={logout}>Logout</button>
      </header>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      {isLoading ? (
        <div className="panel">Loading workspace...</div>
      ) : (
        <div className="dashboard-grid">
          <section className="panel wide">
            <div className="section-heading">
              <h2>Notebooks</h2>
              <span>{notebooks.length} total</span>
            </div>
            <div className="card-grid">
              {notebooks.map((notebook) => (
                <Link key={notebook.id} className="notebook-card" to={`/notebook/${notebook.id}`}>
                  <strong>{notebook.title}</strong>
                  <span>{folders.find((folder) => folder.id === notebook.folder_id)?.title || 'No folder'}</span>
                </Link>
              ))}
              {notebooks.length === 0 && <p className="muted">Create a notebook to start capturing chapters and resources.</p>}
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
                  <div>
                    <strong>{todo.title}</strong>
                    <p>{formatDate(todo.deadline)} · weight {todo.academic_weight} · effort {todo.estimated_effort}</p>
                  </div>
                  <span className={`priority ${String(todo.priority_label || 'low').toLowerCase()}`}>
                    {todo.priority_label || 'LOW'} · {todo.bhps_score ?? 0}
                  </span>
                </article>
              ))}
              {todos.length === 0 && <p className="muted">No todos yet.</p>}
            </div>
          </section>

          <aside className="panel">
            <h2>Your Day</h2>
            <div className="compact-list">
              {upcomingTodos.map((todo) => (
                <div key={todo.id}>
                  <strong>{todo.title}</strong>
                  <span>{formatDate(todo.deadline)}</span>
                </div>
              ))}
              {upcomingTodos.length === 0 && <p className="muted">No upcoming tasks.</p>}
            </div>
          </aside>

          <aside className="panel">
            <h2>Focus Session</h2>
            {activeSession ? (
              <div className="stack">
                <p>Active {activeSession.duration_minutes}-minute session started at {new Date(activeSession.started_at).toLocaleTimeString()}.</p>
                <button type="button" onClick={() => endFocus(activeSession.id)}>End Session</button>
              </div>
            ) : (
              <div className="stack">
                <p className="muted">Start with your highest BHPS recommendation.</p>
                <button type="button" onClick={() => startFocus(recommendedTodos[0]?.id)} disabled={recommendedTodos.length === 0}>Start 50-min Focus</button>
              </div>
            )}
            <div className="compact-list">
              {recommendedTodos.map((todo) => (
                <div key={todo.id}>
                  <strong>{todo.title}</strong>
                  <span>{todo.priority_label} · {todo.bhps_score}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}

export default Dashboard
