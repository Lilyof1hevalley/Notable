import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiRequest } from '../lib/api'

function EditChapter() {
  const { notebookId, chapterId } = useParams()
  const navigate = useNavigate()
  const [chapterForm, setChapterForm] = useState({ title: '', content: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadChapter() {
      try {
        const data = await apiRequest(`/notebooks/${notebookId}/chapters`)
        const chapter = data.chapters.find((c) => c.id === chapterId)
        if (chapter) {
          setChapterForm({ title: chapter.title, content: chapter.content || '' })
        } else {
          setError('Chapter not found.')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    loadChapter()
  }, [notebookId, chapterId])

  async function submitEdit(event) {
    event.preventDefault()
    setMessage('')
    try {
      await apiRequest(`/notebooks/${notebookId}/chapters/${chapterId}`, {
        method: 'PATCH',
        body: JSON.stringify(chapterForm),
      })
      setMessage('Chapter updated.')
      setTimeout(() => {
        navigate(`/notebook/${notebookId}`)
      }, 1000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <Link to={`/notebook/${notebookId}`} className="back-link">Back to notebook</Link>
          <h1>Edit Chapter</h1>
        </div>
      </header>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      {isLoading ? (
        <div className="panel">Loading chapter...</div>
      ) : (
        <section className="panel main-panel">
          <form className="stack" onSubmit={submitEdit}>
            <label>
              Chapter Title
              <input value={chapterForm.title} onChange={(event) => setChapterForm({ ...chapterForm, title: event.target.value })} required />
            </label>
            <label>
              Chapter Content
              <textarea value={chapterForm.content} onChange={(event) => setChapterForm({ ...chapterForm, content: event.target.value })} rows="15" />
            </label>
            <button type="submit">Save Changes</button>
          </form>
        </section>
      )}
    </main>
  )
}

export default EditChapter
