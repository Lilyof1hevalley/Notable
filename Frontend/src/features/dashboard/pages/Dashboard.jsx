import { useAuth } from '../../../app/providers/AuthContext'
import FeedbackBanner from '../../../shared/components/ui/FeedbackBanner'
import CalendarPanel from '../components/CalendarPanel'
import DashboardHeader from '../components/DashboardHeader'
import DashboardModals from '../components/DashboardModals'
import RemindersPanel from '../components/RemindersPanel'
import TimelinePanel from '../components/TimelinePanel'
import WorkspaceGrid from '../components/WorkspaceGrid'
import { useDashboard } from '../hooks/useDashboard'

const styles = `
  .dashboard-page {
    min-height: 100vh;
    background: #f5f4f1;
    font-family: 'Inria Serif', Georgia, serif;
    color: #1a1a1a;
    display: flex;
    flex-direction: column;
  }

  .dashboard-sidebar {
    border-left: 1px solid #dddbd6;
    background: #faf9f7;
  }

  .dashboard-loading {
    font-family: 'Geist Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #aaa;
    padding: 64px 48px;
    text-align: center;
  }
`

function Dashboard() {
  const auth = useAuth()
  const dashboard = useDashboard(auth)
  const {
    activeModal,
    closeModal,
    completeTodo,
    data,
    deleteFolder,
    deleteNotebook,
    deleteTodo,
    editingNotebook,
    error,
    folderTitle,
    isLoading,
    message,
    moveTargetFolder,
    movingNotebook,
    notebookTitle,
    notebookCover,
    openModal,
    openNotebookCoverModal,
    openNotebookMoveModal,
    selectedFolder,
    reminderTodos,
    setFolderTitle,
    setMoveTargetFolder,
    setNotebookTitle,
    setNotebookCover,
    setSelectedFolder,
    setSortMode,
    setStatusFilter,
    setTodoForm,
    setTypeFilter,
    sortMode,
    statusFilter,
    submitFolder,
    submitNotebook,
    submitNotebookCover,
    submitNotebookMove,
    submitTodo,
    todoForm,
    typeFilter,
    visibleTimelineTodos,
    visibleWorkspaceItems,
  } = dashboard

  return (
    <>
      <style>{styles}</style>
      <main className="app-shell dashboard-page">
        <DashboardHeader
          onSortModeChange={setSortMode}
          onStatusFilterChange={setStatusFilter}
          onTypeFilterChange={setTypeFilter}
          profile={data.profile}
          sortMode={sortMode}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
        />
        <FeedbackBanner error={error} message={message} />

        {isLoading ? (
          <div className="dashboard-loading">Loading workspace…</div>
        ) : (
          <div className="dashboard-grid">
            <WorkspaceGrid
              onEditNotebookCover={openNotebookCoverModal}
              onDeleteFolder={deleteFolder}
              onDeleteNotebook={deleteNotebook}
              onMoveNotebook={openNotebookMoveModal}
              onOpenModal={openModal}
              workspaceItems={visibleWorkspaceItems}
            />
            <div className="dashboard-sidebar">
              <CalendarPanel
                activeModal={activeModal}
                onCloseModal={closeModal}
                onOpenModal={openModal}
                profile={data.profile}
              />
              <RemindersPanel reminders={reminderTodos} />
              <TimelinePanel
                onCompleteTodo={completeTodo}
                onDeleteTodo={deleteTodo}
                onOpenModal={openModal}
                todos={visibleTimelineTodos}
              />
            </div>
          </div>
        )}

        <DashboardModals
          activeModal={activeModal}
          editingNotebook={editingNotebook}
          folderTitle={folderTitle}
          folders={data.folders}
          movingNotebook={movingNotebook}
          notebooks={data.notebooks}
          notebookTitle={notebookTitle}
          notebookCover={notebookCover}
          onClose={closeModal}
          onFolderTitleChange={setFolderTitle}
          onMoveTargetFolderChange={setMoveTargetFolder}
          onNotebookTitleChange={setNotebookTitle}
          onNotebookCoverChange={setNotebookCover}
          onSelectedFolderChange={setSelectedFolder}
          onSubmitFolder={submitFolder}
          onSubmitNotebook={submitNotebook}
          onSubmitNotebookCover={submitNotebookCover}
          onSubmitNotebookMove={submitNotebookMove}
          onSubmitTodo={submitTodo}
          onTodoFormChange={setTodoForm}
          selectedFolder={selectedFolder}
          moveTargetFolder={moveTargetFolder}
          todoForm={todoForm}
        />
      </main>
    </>
  )
}

export default Dashboard
