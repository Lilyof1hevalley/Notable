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

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <Link to="/dashboard" className="back-link">Back to dashboard</Link>
          <h1>{notebook?.title || 'Notebook'}</h1>
        </div>
        <div className="search-box">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search chapters" />
          {search && <button type="button" className="ghost-button" onClick={() => setSearch('')}>Clear</button>}
        </div>
      </header>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      {isLoading ? (
        <div className="panel">Loading notebook...</div>
      ) : (
        <div className="notebook-layout">
          <aside className="panel sidebar-panel">
            <h2>Timeline</h2>
            <div className="compact-list">
              {todos.slice(0, 6).map((todo) => (
                <div key={todo.id}>
                  <strong>{todo.title}</strong>
                  <span>{todo.deadline || 'No deadline'} · {todo.priority_label}</span>
                </div>
              ))}
              {todos.length === 0 && <p className="muted">No tasks yet.</p>}
            </div>

            <h2>Resources</h2>
            <div className="compact-list">
              {resources.map((resource) => (
                <div key={resource.id}>
                  <strong>{resource.original_name}</strong>
                  <button type="button" className="ghost-button" onClick={() => handleDownload(resource)}>Download</button>
                </div>
              ))}
              {resources.length === 0 && <p className="muted">No uploaded resources.</p>}
            </div>
          </aside>

          <section className="panel main-panel">
            <div className="section-heading">
              <h2>Chapters</h2>
              <span>{filteredChapters.length} shown</span>
            </div>
            <div className="chapter-list">
              {filteredChapters.map((chapter) => (
                <article key={chapter.id} className="chapter-card">
                  <h3>{chapter.title}</h3>
                  <p>{chapter.content || 'No content yet.'}</p>
                  <span>Created {new Date(chapter.created_at).toLocaleDateString()}</span>
                </article>
              ))}
              {filteredChapters.length === 0 && <p className="muted">No chapters found.</p>}
            </div>
          </section>

          <aside className="panel forms-panel">
            <h2>Add Chapter</h2>
            <form className="stack" onSubmit={submitChapter}>
              <input value={chapterForm.title} onChange={(event) => setChapterForm({ ...chapterForm, title: event.target.value })} placeholder="Chapter title" required />
              <textarea value={chapterForm.content} onChange={(event) => setChapterForm({ ...chapterForm, content: event.target.value })} placeholder="Chapter content" rows="4" />
              <button type="submit">Create Chapter</button>
            </form>

            <h2>Quick Note</h2>
            <form className="stack" onSubmit={submitNote}>
              <input value={noteForm.title} onChange={(event) => setNoteForm({ ...noteForm, title: event.target.value })} placeholder="Note title" required />
              <textarea value={noteForm.content} onChange={(event) => setNoteForm({ ...noteForm, content: event.target.value })} placeholder="Note content" rows="3" required />
              <select value={noteForm.todo_id} onChange={(event) => setNoteForm({ ...noteForm, todo_id: event.target.value })}>
                <option value="">No linked todo</option>
                {todos.map((todo) => <option key={todo.id} value={todo.id}>{todo.title}</option>)}
              </select>
              <button type="submit">Create Note</button>
            </form>

            <div className="compact-list">
              {notes.slice(0, 4).map((note) => (
                <div key={note.id}>
                  <strong>{note.title}</strong>
                  <span>{note.content}</span>
                </div>
              ))}
            </div>

            <h2>Upload Resource</h2>
            <form className="stack" onSubmit={submitResource}>
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
