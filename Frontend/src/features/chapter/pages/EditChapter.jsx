import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import FeedbackBanner from '../../../shared/components/ui/FeedbackBanner'
import ProtectedTopbar from '../../../shared/components/ui/ProtectedTopbar'
import { formatShortDate } from '../../../utils/date'
import {
  downloadNotebookResource,
  getChapterResources,
  getNotebookChapters,
  updateChapter,
} from '../../notebook/notebook.api'

function EditChapter() {
  const { notebookId, chapterId } = useParams()
  const location = useLocation()
  const notebookState = location.state?.fromFolder
    ? { fromFolder: location.state.fromFolder }
    : { fromDashboard: true }
  const [chapter, setChapter] = useState(null)
  const [chapterForm, setChapterForm] = useState({ title: '', content: '' })
  const [resources, setResources] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadChapter() {
      setError('')
      try {
        const [chaptersData, resourcesData] = await Promise.all([
          getNotebookChapters(notebookId),
          getChapterResources(chapterId),
        ])
        const currentChapter = (chaptersData.chapters || []).find((item) => String(item.id) === String(chapterId))
        if (!currentChapter) {
          setError('Chapter not found.')
          return
        }

        setChapter(currentChapter)
        setChapterForm({
          title: currentChapter.title,
          content: currentChapter.content || '',
        })
        setResources(resourcesData.resources || [])
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
    setError('')
    setMessage('')
    setIsSaving(true)
    try {
      await updateChapter(chapterId, chapterForm)
      setChapter((current) => ({
        ...current,
        ...chapterForm,
        updated_at: new Date().toISOString(),
      }))
      setMessage('Chapter updated.')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function download(resource) {
    setError('')
    try {
      await downloadNotebookResource(resource.id, resource.original_name)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="chapter-detail-page">
      <ProtectedTopbar
        backLabel="Notebook"
        backState={notebookState}
        backTo={`/notebook/${notebookId}`}
        className="chapter-detail-topbar"
        title={chapter?.title || 'Chapter'}
      />

      <FeedbackBanner error={error} message={message} />

      {isLoading ? (
        <div className="notebook-loading">Loading chapter...</div>
      ) : (
        <div className="chapter-detail-layout">
          <section className="chapter-reader">
            <div className="chapter-reader__meta">
              <span>Created {formatShortDate(chapter?.created_at)}</span>
              <span>Updated {formatShortDate(chapter?.updated_at || chapter?.created_at)}</span>
            </div>
            <h2>{chapter?.title}</h2>
            <div className="chapter-reader__content">
              {chapter?.content ? (
                chapter.content.split('\n').map((paragraph, index) => (
                  <p key={`${index}-${paragraph}`}>{paragraph || '\u00a0'}</p>
                ))
              ) : (
                <p className="muted">No content yet.</p>
              )}
            </div>

            <div className="chapter-linked-resources">
              <h3>Linked Resources</h3>
              {resources.length === 0 ? (
                <p className="muted">No resources linked to this chapter.</p>
              ) : (
                resources.map((resource) => (
                  <div className="resource-row" key={resource.id}>
                    <p>{resource.original_name}</p>
                    <button
                      aria-label={`Download ${resource.original_name}`}
                      className="resource-row__action"
                      onClick={() => download(resource)}
                      type="button"
                    >
                      ↓
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <aside className="chapter-editor-panel">
            <div className="notebook-panel-header">
              <h2>Edit Chapter</h2>
            </div>
            <form className="chapter-editor-form" onSubmit={submitEdit}>
              <label className="auth-form-label">
                Chapter Title
                <input
                  className="auth-form-input"
                  onChange={(event) => setChapterForm({ ...chapterForm, title: event.target.value })}
                  required
                  value={chapterForm.title}
                />
              </label>
              <label className="auth-form-label">
                Chapter Content
                <textarea
                  className="auth-form-input"
                  onChange={(event) => setChapterForm({ ...chapterForm, content: event.target.value })}
                  rows="14"
                  value={chapterForm.content}
                />
              </label>
              <button className="auth-submit-btn" disabled={isSaving} type="submit">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </aside>
        </div>
      )}
    </main>
  )
}

export default EditChapter
