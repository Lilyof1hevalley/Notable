import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import NotebookCard from '../components/NotebookCard'
import FeedbackBanner from '../components/ui/FeedbackBanner'
import { apiRequest } from '../lib/api'
import { formatDateGroup, formatTime } from '../utils/date'

function groupTodosByDate(todos) {
  return todos.reduce((groups, todo) => {
    const dateKey = formatDateGroup(todo.deadline)
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(todo)
    return groups
  }, {})
}

function FolderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [folder, setFolder] = useState(null)
  const [notebooks, setNotebooks] = useState([])
  const [todos, setTodos] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadFolder = useCallback(async () => {
    setError('')
    try {
      const [foldersData, notebooksData, todosData] = await Promise.all([
        apiRequest('/folders'),
        apiRequest(`/folders/${id}/notebooks`),
        apiRequest('/todos?limit=100'),
      ])
      const currentFolder = (foldersData.folders || []).find((item) => String(item.id) === String(id))
      if (!currentFolder) {
        navigate('/dashboard', { replace: true })
        return
      }

      const folderNotebooks = notebooksData.notebooks || []
      const notebookIds = new Set(folderNotebooks.map((notebook) => String(notebook.id)))
      const folderTodos = (todosData.todos || []).filter((todo) => (
        String(todo.folder_id) === String(id) || notebookIds.has(String(todo.notebook_id))
      ))

      setFolder(currentFolder)
      setNotebooks(folderNotebooks)
      setTodos(folderTodos)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadFolder()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadFolder])

  const todoCountsByNotebookId = useMemo(() => {
    const counts = new Map()
    todos.forEach((todo) => {
      if (!todo.notebook_id) return
      counts.set(String(todo.notebook_id), (counts.get(String(todo.notebook_id)) || 0) + 1)
    })
    return counts
  }, [todos])

  const notebookTitleById = useMemo(
    () => new Map(notebooks.map((notebook) => [String(notebook.id), notebook.title])),
    [notebooks],
  )

  const groupedTodos = useMemo(() => groupTodosByDate(todos), [todos])
  const todoGroups = Object.entries(groupedTodos)

  return (
    <main className="folder-detail-page">
      <header className="notebook-topbar folder-detail-topbar">
        <div className="notebook-topbar__title">
          <Link className="back-link" to="/dashboard">Back to dashboard</Link>
          <h1>{folder?.title || 'Folder'}</h1>
        </div>
      </header>

      <FeedbackBanner error={error} />

      {isLoading ? (
        <div className="notebook-loading">Loading folder...</div>
      ) : (
        <div className="folder-detail-layout">
          <section>
            <div className="folder-detail-section-header">
              <h2>Notebooks</h2>
              <span>{notebooks.length} items</span>
            </div>
            <div className="folder-notebook-grid">
              {notebooks.map((notebook) => (
                <Link className="workspace-item__link" key={notebook.id} to={`/notebook/${notebook.id}`}>
                  <NotebookCard
                    taskCount={todoCountsByNotebookId.get(String(notebook.id)) || 0}
                    title={notebook.title}
                  />
                </Link>
              ))}
              {notebooks.length === 0 && <p className="muted">No notebooks in this folder yet.</p>}
            </div>
          </section>

          <aside className="notebook-panel folder-detail-timeline">
            <div className="notebook-panel-header">
              <h2>Timeline</h2>
            </div>
            {todoGroups.length === 0 ? (
              <p className="muted notebook-panel__empty">No folder tasks yet.</p>
            ) : (
              <div className="notebook-panel__scroller">
                {todoGroups.map(([date, groupTodos]) => (
                  <div key={date}>
                    <div className="date-header">{date}</div>
                    {groupTodos.map((todo) => (
                      <article className={`pill-card${todo.is_completed ? ' pill-card--completed' : ''}`} key={todo.id}>
                        <span className="pill-card__status" />
                        <div className="pill-card__copy">
                          <p className="pill-card-title">{todo.title}</p>
                          <p className="pill-card-subtitle">{formatTime(todo.deadline)}</p>
                        </div>
                        <span className="pill-card-meta">
                          {notebookTitleById.get(String(todo.notebook_id)) || folder.title}
                        </span>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  )
}

export default FolderDetail
