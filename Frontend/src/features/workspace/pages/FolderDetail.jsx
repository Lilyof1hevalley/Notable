import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FeedbackBanner from '../../../shared/components/ui/FeedbackBanner'
import Modal from '../../../shared/components/ui/Modal'
import ProtectedTopbar from '../../../shared/components/ui/ProtectedTopbar'
import { formatDateGroup, formatTime } from '../../../utils/date'
import NotebookCardActions from '../components/NotebookCardActions'
import NotebookCoverPicker from '../components/NotebookCoverPicker'
import NotebookCard from '../components/NotebookCard'
import {
  EMPTY_NOTEBOOK_COVER,
  getNotebookCoverForm,
  getNotebookCoverPayload,
} from '../notebookCover'
import {
  createNotebook,
  deleteNotebook as deleteNotebookRequest,
  getFolderNotebooks,
  getFolders,
  getTodos,
  updateNotebook,
} from '../workspace.api'

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
  const [folders, setFolders] = useState([])
  const [notebooks, setNotebooks] = useState([])
  const [todos, setTodos] = useState([])
  const [notebookTitle, setNotebookTitle] = useState('')
  const [notebookCover, setNotebookCover] = useState(EMPTY_NOTEBOOK_COVER)
  const [editingNotebook, setEditingNotebook] = useState(null)
  const [movingNotebook, setMovingNotebook] = useState(null)
  const [moveTargetFolder, setMoveTargetFolder] = useState('')
  const [isCreateNotebookOpen, setIsCreateNotebookOpen] = useState(false)
  const [isEditCoverOpen, setIsEditCoverOpen] = useState(false)
  const [isMoveNotebookOpen, setIsMoveNotebookOpen] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadFolder = useCallback(async () => {
    setError('')
    try {
      const [foldersData, notebooksData, todosData] = await Promise.all([
        getFolders(),
        getFolderNotebooks(id),
        getTodos('?limit=100'),
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
      setFolders(foldersData.folders || [])
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

  async function submitNotebook(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      await createNotebook({
        title: notebookTitle,
        folder_id: id,
        ...getNotebookCoverPayload(notebookCover),
      })
      setNotebookTitle('')
      setNotebookCover(EMPTY_NOTEBOOK_COVER)
      setIsCreateNotebookOpen(false)
      setMessage('Notebook created.')
      await loadFolder()
    } catch (err) {
      setError(err.message)
    }
  }

  function openEditCover(notebook) {
    setEditingNotebook(notebook)
    setNotebookCover(getNotebookCoverForm(notebook))
    setIsEditCoverOpen(true)
  }

  function openMoveNotebook(notebook) {
    setMovingNotebook(notebook)
    setMoveTargetFolder(notebook.folder_id || '')
    setIsMoveNotebookOpen(true)
  }

  function closeMoveNotebook() {
    setMovingNotebook(null)
    setMoveTargetFolder('')
    setIsMoveNotebookOpen(false)
  }

  function closeEditCover() {
    setEditingNotebook(null)
    setNotebookCover(EMPTY_NOTEBOOK_COVER)
    setIsEditCoverOpen(false)
  }

  async function submitNotebookCover(event) {
    event.preventDefault()
    if (!editingNotebook) return

    setError('')
    setMessage('')

    try {
      await updateNotebook(editingNotebook.id, {
        title: editingNotebook.title,
        folder_id: editingNotebook.folder_id || null,
        ...getNotebookCoverPayload(notebookCover, editingNotebook),
      })
      closeEditCover()
      setMessage('Notebook cover updated.')
      await loadFolder()
    } catch (err) {
      setError(err.message)
    }
  }

  async function submitNotebookMove(event) {
    event.preventDefault()
    if (!movingNotebook) return

    setError('')
    setMessage('')

    try {
      await updateNotebook(movingNotebook.id, {
        title: movingNotebook.title,
        folder_id: moveTargetFolder || null,
      })
      closeMoveNotebook()
      setMessage('Notebook moved.')
      await loadFolder()
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteNotebook(notebookId) {
    if (!window.confirm('Are you sure you want to delete this notebook?')) return

    setError('')
    setMessage('')

    try {
      await deleteNotebookRequest(notebookId)
      setMessage('Notebook deleted.')
      await loadFolder()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="app-shell folder-detail-page">
      <ProtectedTopbar
        actions={(
          <button
            className="dashboard-tool-button dashboard-tool-button--text"
            onClick={() => setIsCreateNotebookOpen(true)}
            type="button"
          >
            Add Notebook
          </button>
        )}
        backLabel="Dashboard"
        backTo="/dashboard"
        className="folder-detail-topbar"
        title={folder?.title || 'Folder'}
      />

      <FeedbackBanner error={error} message={message} />

      {isLoading ? (
        <div className="notebook-loading">Loading folder...</div>
      ) : (
        <div className="folder-detail-layout">
          <section className="folder-detail-workspace">
            <div className="folder-detail-section-header">
              <h2>Notebooks</h2>
              <div className="inline-actions">
                <span>{notebooks.length} items</span>
              </div>
            </div>
            <div className="folder-notebook-grid">
              {notebooks.map((notebook) => (
                <div className="workspace-item folder-detail-notebook-item" key={notebook.id}>
                  <Link
                    className="workspace-item__link"
                    state={{ fromFolder: { id, title: folder.title } }}
                    to={`/notebook/${notebook.id}`}
                  >
                    <NotebookCard
                      coverColor={notebook.cover_color}
                      coverImageFilename={notebook.cover_image_filename}
                      coverType={notebook.cover_type}
                      notebookId={notebook.id}
                      taskCount={todoCountsByNotebookId.get(String(notebook.id)) || 0}
                      title={notebook.title}
                    />
                  </Link>
                  <NotebookCardActions
                    notebook={notebook}
                    onDelete={deleteNotebook}
                    onEditCover={openEditCover}
                    onMove={openMoveNotebook}
                  />
                </div>
              ))}
              <button
                aria-label="Create notebook"
                className="add-card-button add-card-button--dashboard folder-detail-add-card"
                onClick={() => setIsCreateNotebookOpen(true)}
                type="button"
              >
                <span aria-hidden="true">+</span>
                <span className="add-card-button__action">Notebook</span>
              </button>
              {notebooks.length === 0 && <p className="muted">No notebooks in this folder yet.</p>}
            </div>
          </section>

          <aside className="dashboard-panel dashboard-panel--timeline folder-detail-timeline">
            <div className="dashboard-panel__header">
              <h2>Timeline</h2>
            </div>
            <div className="dashboard-panel__body">
              {todoGroups.length === 0 ? (
                <p className="muted dashboard-panel__empty">No folder tasks yet.</p>
              ) : (
                <div className="dashboard-panel__scroller folder-detail-timeline__scroller">
                  {todoGroups.map(([date, groupTodos]) => (
                    <div key={date}>
                      <div className="dashboard-date-header">{date}</div>
                      {groupTodos.map((todo) => (
                        <article className={`pill-card folder-detail-task${todo.is_completed ? ' pill-card--completed' : ''}`} key={todo.id}>
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
            </div>
          </aside>
        </div>
      )}

      <Modal
        isOpen={isCreateNotebookOpen}
        onClose={() => {
          setNotebookCover(EMPTY_NOTEBOOK_COVER)
          setIsCreateNotebookOpen(false)
        }}
        size="dialog"
        title="Create Notebook"
      >
        <form className="stack modal-form" onSubmit={submitNotebook}>
          <label className="auth-form-label">
            Notebook title
            <input
              className="auth-form-input"
              onChange={(event) => setNotebookTitle(event.target.value)}
              required
              value={notebookTitle}
            />
          </label>
          <p className="muted folder-detail-modal-note">
            This notebook will be added to {folder?.title || 'this folder'}.
          </p>
          <NotebookCoverPicker onChange={setNotebookCover} value={notebookCover} />
          <button className="auth-submit-btn" type="submit">Create Notebook</button>
        </form>
      </Modal>

      <Modal
        isOpen={isEditCoverOpen}
        onClose={closeEditCover}
        size="dialog"
        title="Edit Notebook Cover"
      >
        <form className="stack modal-form" onSubmit={submitNotebookCover}>
          <NotebookCoverPicker
            hasImageCover={editingNotebook?.cover_type === 'image'}
            onChange={setNotebookCover}
            value={notebookCover}
          />
          <button className="auth-submit-btn" type="submit">Save Cover</button>
        </form>
      </Modal>

      <Modal
        isOpen={isMoveNotebookOpen}
        onClose={closeMoveNotebook}
        size="dialog"
        title="Move Notebook"
      >
        <form className="stack modal-form" onSubmit={submitNotebookMove}>
          <label className="auth-form-label">
            Notebook
            <input
              className="auth-form-input"
              disabled
              readOnly
              value={movingNotebook?.title || ''}
            />
          </label>
          <label className="auth-form-label">
            Folder
            <select
              className="auth-form-input"
              onChange={(event) => setMoveTargetFolder(event.target.value)}
              value={moveTargetFolder}
            >
              <option value="">No folder</option>
              {folders.map((folderOption) => (
                <option key={folderOption.id} value={folderOption.id}>
                  {folderOption.title}
                </option>
              ))}
            </select>
          </label>
          <button className="auth-submit-btn" type="submit">Move Notebook</button>
        </form>
      </Modal>
    </main>
  )
}

export default FolderDetail
