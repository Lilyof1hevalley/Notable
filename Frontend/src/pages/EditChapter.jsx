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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to={`/notebook/${notebookId}`} className="back-link" style={{ fontSize: '12px', marginBottom: '4px', color: '#68768d' }}>← Back to notebook</Link>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1A303A' }}>Edit Chapter</h1>
          </div>
        </div>
      </header>

      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      {isLoading ? (
        <div className="panel">Loading chapter...</div>
      ) : (
        <section className="panel main-panel">
          <form className="stack" onSubmit={submitEdit}>
            <label className="auth-form-label">
              Chapter Title
              <input className="auth-form-input" style={{ marginTop: '8px' }} value={chapterForm.title} onChange={(event) => setChapterForm({ ...chapterForm, title: event.target.value })} required />
            </label>
            <label className="auth-form-label">
              Chapter Content
              <textarea className="auth-form-input" style={{ marginTop: '8px' }} value={chapterForm.content} onChange={(event) => setChapterForm({ ...chapterForm, content: event.target.value })} rows="15" />
            </label>
            <button type="submit" className="auth-submit-btn">Save Changes</button>
          </form>
        </section>
      )}
    </main>
  )
}

export default EditChapter
