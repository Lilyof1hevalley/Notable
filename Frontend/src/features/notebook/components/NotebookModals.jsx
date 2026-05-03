import Modal from '../../../shared/components/ui/Modal'
import { NOTEBOOK_MODAL } from '../hooks/useNotebook'

function NotebookModals({
  activeModal,
  chapterForm,
  chapters,
  noteForm,
  onChapterFormChange,
  onClose,
  onNoteFormChange,
  onResourceFormChange,
  onSubmitChapter,
  onSubmitNote,
  onSubmitResource,
  resourceForm,
  todos,
}) {
  return (
    <>
      <Modal
        isOpen={activeModal === NOTEBOOK_MODAL.CHAPTER}
        onClose={onClose}
        size="dialog"
        title="Add Chapter"
      >
        <form className="stack modal-form" onSubmit={onSubmitChapter}>
          <label className="auth-form-label">
            Chapter title
            <input
              className="auth-form-input"
              onChange={(event) => onChapterFormChange({ ...chapterForm, title: event.target.value })}
              required
              value={chapterForm.title}
            />
          </label>
          <label className="auth-form-label">
            Chapter content
            <textarea
              className="auth-form-input"
              onChange={(event) => onChapterFormChange({ ...chapterForm, content: event.target.value })}
              rows="4"
              value={chapterForm.content}
            />
          </label>
          <button className="auth-submit-btn" type="submit">Create Chapter</button>
        </form>
      </Modal>

      <Modal
        isOpen={activeModal === NOTEBOOK_MODAL.NOTE}
        onClose={onClose}
        size="dialog"
        title="Quick Note"
      >
        <form className="stack modal-form" onSubmit={onSubmitNote}>
          <label className="auth-form-label">
            Note title
            <input
              className="auth-form-input"
              onChange={(event) => onNoteFormChange({ ...noteForm, title: event.target.value })}
              required
              value={noteForm.title}
            />
          </label>
          <label className="auth-form-label">
            Note content
            <textarea
              className="auth-form-input"
              onChange={(event) => onNoteFormChange({ ...noteForm, content: event.target.value })}
              required
              rows="3"
              value={noteForm.content}
            />
          </label>
          <label className="auth-form-label">
            Linked todo
            <select
              className="auth-form-input"
              onChange={(event) => onNoteFormChange({ ...noteForm, todo_id: event.target.value })}
              value={noteForm.todo_id}
            >
              <option value="">No linked todo</option>
              {todos.map((todo) => <option key={todo.id} value={todo.id}>{todo.title}</option>)}
            </select>
          </label>
          <button className="auth-submit-btn" type="submit">Create Note</button>
        </form>
      </Modal>

      <Modal
        isOpen={activeModal === NOTEBOOK_MODAL.RESOURCE}
        onClose={onClose}
        size="dialog"
        title="Upload Resource"
      >
        <form className="stack modal-form" onSubmit={onSubmitResource}>
          <label className="auth-form-label">
            Resource file
            <input
              className="auth-form-input"
              onChange={(event) => onResourceFormChange({
                ...resourceForm,
                file: event.target.files[0] || null,
              })}
              required
              type="file"
            />
          </label>
          <label className="auth-form-label">
            Attach to
            <select
              className="auth-form-input"
              onChange={(event) => onResourceFormChange({
                ...resourceForm,
                chapter_id: event.target.value,
              })}
              value={resourceForm.chapter_id}
            >
              <option value="">Notebook-level resource</option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
              ))}
            </select>
          </label>
          <button className="auth-submit-btn" type="submit">Upload Resource</button>
        </form>
      </Modal>
    </>
  )
}

export default NotebookModals
