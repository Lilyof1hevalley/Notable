import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiRequest, downloadResource } from '../lib/api'

function Notebook() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [notebook, setNotebook] = useState(null)
  const [chapters, setChapters] = useState([])
  const [resources, setResources] = useState([])
  const [notes, setNotes] = useState([])
  const [todos, setTodos] = useState([])
  const [search, setSearch] = useState('')
  const [chapterForm, setChapterForm] = useState({ title: '', content: '' })
  const [noteForm, setNoteForm] = useState({ title: '', content: '', todo_id: '' })
  const [resourceForm, setResourceForm] = useState({ file: null, chapter_id: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function loadNotebook() {
    setError('')
    try {
      const [notebooksData, chaptersData, resourcesData, notesData, todosData] = await Promise.all([
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
      setNotes(notesData.notes)
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

  async function submitChapter(event) {
    event.preventDefault()
    setMessage('')
    try {
      await apiRequest(`/notebooks/${id}/chapters`, {
        method: 'POST',
        body: JSON.stringify(chapterForm),
      })
      setChapterForm({ title: '', content: '' })
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
      event.target.reset()
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
    <main className="app-shell">
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to="/dashboard" className="back-link" style={{ fontSize: '12px', marginBottom: '4px', color: '#68768d' }}>← Back to dashboard</Link>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1A303A' }}>{notebook?.title || 'Notebook'}</h1>
          </div>
        </div>
        <div className="search-box" style={{ background: '#FAFAFA', border: '1px solid #E5E5E5', borderRadius: '6px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search chapters" style={{ background: 'transparent', border: 'none', padding: 0, outline: 'none', color: '#1A1A1A', fontSize: '14px' }} />
          {search && <button type="button" className="ghost-button" onClick={() => setSearch('')} style={{ padding: '4px 8px', fontSize: '12px', border: 'none' }}>Clear</button>}
        </div>
      </header>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      {isLoading ? (
        <div className="panel">Loading notebook...</div>
      ) : (
        <div className="notebook-layout">
          <aside className="panel sidebar-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="section-heading" style={{ background: '#FAFAFA', borderBottom: '1px solid #E5E5E5', padding: '16px 20px', margin: 0, borderRadius: '12px 12px 0 0' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1A303A' }}>Timeline</h2>
            </div>
            <div className="compact-list" style={{ padding: '16px' }}>
              {todos.slice(0, 6).map((todo) => (
                <div key={todo.id}>
                  <strong>{todo.title}</strong>
                  <span>{todo.deadline || 'No deadline'} · {todo.priority_label}</span>
                </div>
              ))}
              {todos.length === 0 && <p className="muted">No tasks yet.</p>}
            </div>

            <div className="section-heading" style={{ background: '#FAFAFA', borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5', padding: '16px 20px', margin: 0 }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1A303A' }}>Resources</h2>
            </div>
            <div className="compact-list" style={{ padding: '16px' }}>
              {resources.map((resource) => (
                <div key={resource.id}>
                  <strong>{resource.original_name}</strong>
                  <button type="button" className="ghost-button" onClick={() => handleDownload(resource)}>Download</button>
                </div>
              ))}
              {resources.length === 0 && <p className="muted">No uploaded resources.</p>}
            </div>
          </aside>

          <section className="panel main-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="section-heading" style={{ background: '#FAFAFA', borderBottom: '1px solid #E5E5E5', padding: '16px 20px', margin: 0, borderRadius: '12px 12px 0 0' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1A303A' }}>Chapters</h2>
              <span style={{ fontSize: '12px', color: '#68768d' }}>{filteredChapters.length} shown</span>
            </div>
            <div className="chapter-list" style={{ padding: '16px' }}>
              {filteredChapters.map((chapter) => (
                <article key={chapter.id} className="chapter-card">
                  <div className="card-actions">
                    <h3 style={{ margin: 0 }}>{chapter.title}</h3>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <Link to={`/notebook/${id}/chapter/${chapter.id}/edit`} className="icon-button" style={{ textDecoration: 'none' }} title="Edit Chapter">✏️</Link>
                      <button type="button" className="icon-button" onClick={() => deleteChapter(chapter.id)} title="Delete Chapter">🗑️</button>
                    </div>
                  </div>
                  <p style={{ marginTop: '12px' }}>{chapter.content || 'No content yet.'}</p>
                  <span>Created {new Date(chapter.created_at).toLocaleDateString()}</span>
                </article>
              ))}
              {filteredChapters.length === 0 && <p className="muted">No chapters found.</p>}
            </div>
          </section>

          <aside className="panel forms-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="section-heading" style={{ background: '#FAFAFA', borderBottom: '1px solid #E5E5E5', padding: '16px 20px', margin: 0, borderRadius: '12px 12px 0 0' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1A303A' }}>Add Chapter</h2>
            </div>
            <form className="stack" onSubmit={submitChapter} style={{ padding: '16px' }}>
              <input value={chapterForm.title} onChange={(event) => setChapterForm({ ...chapterForm, title: event.target.value })} placeholder="Chapter title" required />
              <textarea value={chapterForm.content} onChange={(event) => setChapterForm({ ...chapterForm, content: event.target.value })} placeholder="Chapter content" rows="4" />
              <button type="submit">Create Chapter</button>
            </form>

            <div className="section-heading" style={{ background: '#FAFAFA', borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5', padding: '16px 20px', margin: 0 }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1A303A' }}>Quick Note</h2>
            </div>
            <form className="stack" onSubmit={submitNote} style={{ padding: '16px', paddingBottom: '8px' }}>
              <input value={noteForm.title} onChange={(event) => setNoteForm({ ...noteForm, title: event.target.value })} placeholder="Note title" required />
              <textarea value={noteForm.content} onChange={(event) => setNoteForm({ ...noteForm, content: event.target.value })} placeholder="Note content" rows="3" required />
              <select value={noteForm.todo_id} onChange={(event) => setNoteForm({ ...noteForm, todo_id: event.target.value })}>
                <option value="">No linked todo</option>
                {todos.map((todo) => <option key={todo.id} value={todo.id}>{todo.title}</option>)}
              </select>
              <button type="submit">Create Note</button>
            </form>

            <div className="compact-list" style={{ padding: '0 16px 16px 16px' }}>
              {notes.slice(0, 4).map((note) => (
                <div key={note.id}>
                  <strong>{note.title}</strong>
                  <span>{note.content}</span>
                </div>
              ))}
            </div>

            <div className="section-heading" style={{ background: '#FAFAFA', borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5', padding: '16px 20px', margin: 0 }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1A303A' }}>Upload Resource</h2>
            </div>
            <form className="stack" onSubmit={submitResource} style={{ padding: '16px' }}>
              <input type="file" onChange={(event) => setResourceForm({ ...resourceForm, file: event.target.files[0] || null })} required />
              <select value={resourceForm.chapter_id} onChange={(event) => setResourceForm({ ...resourceForm, chapter_id: event.target.value })}>
                <option value="">Notebook-level resource</option>
                {chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}
              </select>
              <button type="submit">Upload Resource</button>
            </form>
          </aside>
        </div>
      )}
    </main>
  )
}

export default Notebook
