import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FeedbackBanner from '../components/ui/FeedbackBanner'
import ChapterList from '../features/notebook/components/ChapterList'
import NotebookModals from '../features/notebook/components/NotebookModals'
import NotebookTimelinePanel from '../features/notebook/components/NotebookTimelinePanel'
import NotebookTopbar from '../features/notebook/components/NotebookTopbar'
import NotesPanel from '../features/notebook/components/NotesPanel'
import ResourcesPanel from '../features/notebook/components/ResourcesPanel'
import { useNotebook } from '../features/notebook/hooks/useNotebook'

function Notebook() {
  const { id } = useParams()
  const navigate = useNavigate()
  const onMissingNotebook = useCallback(() => {
    navigate('/dashboard', { replace: true })
  }, [navigate])
  const notebook = useNotebook({ id, onMissingNotebook })
  const {
    activeModal,
    chapterForm,
    chapters,
    closeModal,
    completeTodo,
    deleteChapter,
    deleteTodo,
    download,
    error,
    filteredChapters,
    groupedTodos,
    isLoading,
    message,
    noteForm,
    notes,
    notebook: notebookData,
    openModal,
    resourceForm,
    resources,
    search,
    setChapterForm,
    setNoteForm,
    setResourceForm,
    setSearch,
    submitChapter,
    submitNote,
    submitResource,
    todos,
  } = notebook

  return (
    <div className="notebook-page">
      <NotebookTopbar
        notebook={notebookData}
        onOpenModal={openModal}
        onSearchChange={setSearch}
        onSearchClear={() => setSearch('')}
        search={search}
      />

      <FeedbackBanner className="notebook-feedback" error={error} message={message} />

      {isLoading ? (
        <div className="notebook-loading">Loading notebook...</div>
      ) : (
        <div className="notebook-layout-new">
          <div>
            <NotebookTimelinePanel
              groupedTodos={groupedTodos}
              notebookTitle={notebookData?.title}
              onCompleteTodo={completeTodo}
              onDeleteTodo={deleteTodo}
              onOpenModal={openModal}
            />
            <NotesPanel notes={notes} />
            <ResourcesPanel
              onDownload={download}
              onOpenModal={openModal}
              resources={resources}
            />
          </div>

          <div>
            <ChapterList
              chapters={filteredChapters}
              notebookId={id}
              onDeleteChapter={deleteChapter}
            />
          </div>
        </div>
      )}

      <NotebookModals
        activeModal={activeModal}
        chapterForm={chapterForm}
        chapters={chapters}
        noteForm={noteForm}
        onChapterFormChange={setChapterForm}
        onClose={closeModal}
        onNoteFormChange={setNoteForm}
        onResourceFormChange={setResourceForm}
        onSubmitChapter={submitChapter}
        onSubmitNote={submitNote}
        onSubmitResource={submitResource}
        resourceForm={resourceForm}
        todos={todos}
      />
    </div>
  )
}

export default Notebook
