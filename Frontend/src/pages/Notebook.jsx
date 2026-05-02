import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiRequest, downloadResource } from '../lib/api'

function Notebook() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [notebook, setNotebook] = useState(null)
  const [chapters, setChapters] = useState([])
  const [resources, setResources] = useState([])
  // notes state removed because it's not rendered in new mockup
  const [todos, setTodos] = useState([])
  const [search, setSearch] = useState('')
  const [chapterForm, setChapterForm] = useState({ title: '', content: '' })
  const [noteForm, setNoteForm] = useState({ title: '', content: '', todo_id: '' })
  const [resourceForm, setResourceForm] = useState({ file: null, chapter_id: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Modals
  const [showAddChapter, setShowAddChapter] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [showAddResource, setShowAddResource] = useState(false)

  async function loadNotebook() {
    setError('')
    try {
      const [notebooksData, chaptersData, resourcesData, , todosData] = await Promise.all([
        apiRequest('/notebooks'),
        apiRequest(`/notebooks/${id}/chapters`),
        apiRequest(`/resources/notebook/${id}`),
        apiRequest('/notes'),
        apiRequest('/todos?limit=100'),
      ])
      const currentNotebook = notebooksData.notebooks.find((item) => item.id === id)
      if (!currentNotebook) {
        navigate('/dashboard', { replace: true })
        return
      }
      setNotebook(currentNotebook)
      setChapters(chaptersData.chapters)
      setResources(resourcesData.resources)
      // notesData.notes not used in new mockup
      setTodos(todosData.todos)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNotebook()
    }, 0)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const filteredChapters = useMemo(() => (
    chapters.filter((chapter) => (
      chapter.title.toLowerCase().includes(search.toLowerCase())
      || (chapter.content || '').toLowerCase().includes(search.toLowerCase())
    ))
  ), [chapters, search])

  // Group Todos by Date
  const groupedTodos = useMemo(() => {
    const groups = {}
    todos.forEach(todo => {
      let dateKey = 'No Date'
      if (todo.deadline) {
        const d = new Date(todo.deadline)
        if (!isNaN(d)) {
          dateKey = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        }
      }
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(todo)
    })
    return groups
  }, [todos])

  async function submitChapter(event) {
    event.preventDefault()
    setMessage('')
    try {
      await apiRequest(`/notebooks/${id}/chapters`, {
        method: 'POST',
        body: JSON.stringify(chapterForm),
      })
      setChapterForm({ title: '', content: '' })
      setShowAddChapter(false)
      setMessage('Chapter created.')
      await loadNotebook()
    } catch (err) {
      setError(err.message)
    }
  }

  async function submitNote(event) {
    event.preventDefault()
    setMessage('')
    try {
      await apiRequest('/notes', {
        method: 'POST',
        body: JSON.stringify({
          title: noteForm.title,
          content: noteForm.content,
          todo_id: noteForm.todo_id || null,
        }),
      })
      setNoteForm({ title: '', content: '', todo_id: '' })
      setShowAddNote(false)
      setMessage('Note created.')
      await loadNotebook()
    } catch (err) {
      setError(err.message)
    }
  }

  async function submitResource(event) {
    event.preventDefault()
    setMessage('')
    if (!resourceForm.file) {
      setError('Choose a file first.')
      return
    }
    const formData = new FormData()
    formData.append('file', resourceForm.file)
    formData.append('notebook_id', id)
    if (resourceForm.chapter_id) {
      formData.append('chapter_id', resourceForm.chapter_id)
    }
    try {
      await apiRequest('/resources', {
        method: 'POST',
        body: formData,
      })
      setResourceForm({ file: null, chapter_id: '' })
      setShowAddResource(false)
      setMessage('Resource uploaded.')
      await loadNotebook()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDownload(resource) {
    setError('')
    try {
      await downloadResource(resource.id, resource.original_name)
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteChapter(chapterId) {
    if (!window.confirm('Are you sure you want to delete this chapter?')) return
    setMessage('')
    try {
      await apiRequest(`/notebooks/${id}/chapters/${chapterId}`, { method: 'DELETE' })
      setMessage('Chapter deleted.')
      await loadNotebook()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="notebook-page">
      <header className="notebook-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#4F5E6B', fontSize: '24px' }}>←</Link>
          <h1>{notebook?.title || 'Notebook Title'}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="notebook-search">
            <span style={{ fontSize: '14px', color: '#68768d' }}>🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
            {search && <button type="button" onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontSize: '12px' }}>✕</button>}
          </div>
          <button className="icon-button" title="Filter" style={{ fontSize: '20px' }}>⏳</button>
          <button className="icon-button" title="Sort" style={{ fontSize: '20px' }}>🔃</button>
          <button className="plus-btn" onClick={() => setShowAddChapter(true)} style={{ marginLeft: '8px' }}>+</button>
        </div>
      </header>

      {error && <div className="error" style={{ margin: '0 32px 16px' }}>{error}</div>}
      {message && <div className="success" style={{ margin: '0 32px 16px' }}>{message}</div>}

      {isLoading ? (
        <div style={{ padding: '0 32px' }}>Loading notebook...</div>
      ) : (
        <div className="notebook-layout-new">
          {/* Left Column */}
          <div>
            <div className="notebook-panel">
              <div className="notebook-panel-header">
                <h2>Timeline</h2>
                <button className="plus-btn" onClick={() => setShowAddNote(true)}>+</button>
              </div>
              
              {Object.keys(groupedTodos).length === 0 ? (
                <p className="muted" style={{ fontSize: '13px' }}>No tasks.</p>
              ) : (
                Object.entries(groupedTodos).map(([date, groupTodos]) => (
                  <div key={date}>
                    <div className="date-header">{date}</div>
                    {groupTodos.map(todo => (
                      <div className="pill-card" key={todo.id}>
                        <input type="radio" style={{ margin: 0 }} />
                        <div>
                          <p className="pill-card-title">{todo.title}</p>
                          <p className="pill-card-subtitle">
                            {todo.deadline ? new Date(todo.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All day'}
                          </p>
                        </div>
                        <span className="pill-card-meta">Folder/Notebook</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            <div className="notebook-panel">
              <div className="notebook-panel-header">
                <h2>Resources</h2>
                <button className="plus-btn" onClick={() => setShowAddResource(true)}>+</button>
              </div>
              {resources.length === 0 ? (
                <p className="muted" style={{ fontSize: '13px' }}>No resources.</p>
              ) : (
                resources.map(resource => (
                  <div className="pill-card" key={resource.id} style={{ padding: '8px 16px' }}>
                    <p className="pill-card-title" style={{ flex: 1, fontSize: '13px' }}>{resource.original_name}</p>
                    <button type="button" onClick={() => handleDownload(resource)} style={{ background: 'transparent', color: '#4F5E6B', padding: 0, fontSize: '16px' }}>↓</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column (Chapters) */}
          <div>
            {filteredChapters.length === 0 ? (
              <p className="muted">No chapters found.</p>
            ) : (
              filteredChapters.map(chapter => (
                <div className="chapter-card-new" key={chapter.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3>{chapter.title}</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/notebook/${id}/chapter/${chapter.id}/edit`} style={{ textDecoration: 'none', color: '#4F5E6B' }} title="Edit">✏️</Link>
                      <button onClick={() => deleteChapter(chapter.id)} style={{ background: 'transparent', padding: 0, color: '#4F5E6B' }} title="Delete">🗑️</button>
                    </div>
                  </div>
                  <p>{chapter.content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nisi urna, ultricies sit amet dictum id...'}</p>
                  <div className="chapter-meta">
                    Created On: {new Date(chapter.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddChapter && (
        <div className="modal-overlay" onClick={() => setShowAddChapter(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Chapter</h2>
              <button className="icon-button" onClick={() => setShowAddChapter(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form className="stack" onSubmit={submitChapter}>
                <input className="auth-form-input" value={chapterForm.title} onChange={(event) => setChapterForm({ ...chapterForm, title: event.target.value })} placeholder="Chapter title" required />
                <textarea className="auth-form-input" value={chapterForm.content} onChange={(event) => setChapterForm({ ...chapterForm, content: event.target.value })} placeholder="Chapter content" rows="4" />
                <button type="submit" className="auth-submit-btn">Create Chapter</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showAddNote && (
        <div className="modal-overlay" onClick={() => setShowAddNote(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Quick Note</h2>
              <button className="icon-button" onClick={() => setShowAddNote(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form className="stack" onSubmit={submitNote}>
                <input className="auth-form-input" value={noteForm.title} onChange={(event) => setNoteForm({ ...noteForm, title: event.target.value })} placeholder="Note title" required />
                <textarea className="auth-form-input" value={noteForm.content} onChange={(event) => setNoteForm({ ...noteForm, content: event.target.value })} placeholder="Note content" rows="3" required />
                <select className="auth-form-input" value={noteForm.todo_id} onChange={(event) => setNoteForm({ ...noteForm, todo_id: event.target.value })}>
                  <option value="">No linked todo</option>
                  {todos.map((todo) => <option key={todo.id} value={todo.id}>{todo.title}</option>)}
                </select>
                <button type="submit" className="auth-submit-btn">Create Note</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showAddResource && (
        <div className="modal-overlay" onClick={() => setShowAddResource(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Resource</h2>
              <button className="icon-button" onClick={() => setShowAddResource(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form className="stack" onSubmit={submitResource}>
                <input type="file" onChange={(event) => setResourceForm({ ...resourceForm, file: event.target.files[0] || null })} required />
                <select className="auth-form-input" value={resourceForm.chapter_id} onChange={(event) => setResourceForm({ ...resourceForm, chapter_id: event.target.value })}>
                  <option value="">Notebook-level resource</option>
                  {chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}
                </select>
                <button type="submit" className="auth-submit-btn">Upload Resource</button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Notebook
