import FeedbackBanner from '../components/ui/FeedbackBanner'
import CalendarPanel from '../features/dashboard/components/CalendarPanel'
import DashboardHeader from '../features/dashboard/components/DashboardHeader'
import DashboardModals from '../features/dashboard/components/DashboardModals'
import FocusPanel from '../features/dashboard/components/FocusPanel'
import RemindersPanel from '../features/dashboard/components/RemindersPanel'
import TimelinePanel from '../features/dashboard/components/TimelinePanel'
import WorkspaceGrid from '../features/dashboard/components/WorkspaceGrid'
import { useDashboard } from '../features/dashboard/hooks/useDashboard'
import { useFocusSession } from '../features/focus/FocusSessionContext'
import { useAuth } from '../lib/AuthContext'

function Dashboard() {
  const auth = useAuth()
  const focus = useFocusSession()
  const dashboard = useDashboard(auth)
  const {
    activeModal,
    closeModal,
    completeTodo,
    data,
    deleteNotebook,
    deleteTodo,
    error,
    folderTitle,
    isLoading,
    message,
    notebookTitle,
    openModal,
    selectedFolder,
    search,
    reminderTodos,
    setFolderTitle,
    setNotebookTitle,
    setSearch,
    setSelectedFolder,
    setSortMode,
    setStatusFilter,
    setTodoForm,
    setTypeFilter,
    sortMode,
    statusFilter,
    submitFolder,
    submitNotebook,
    submitTodo,
    todoForm,
    typeFilter,
    visibleTimelineTodos,
    visibleWorkspaceItems,
  } = dashboard

  return (
    <main className="app-shell dashboard-page">
      <DashboardHeader
        onSearchChange={setSearch}
        onSortModeChange={setSortMode}
        onStatusFilterChange={setStatusFilter}
        onTypeFilterChange={setTypeFilter}
        profile={data.profile}
        search={search}
        sortMode={sortMode}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
      />
      <FeedbackBanner error={error} message={message} />

      {isLoading ? (
        <div className="panel">Loading workspace...</div>
      ) : (
        <div className="dashboard-grid">
          <WorkspaceGrid
            onDeleteNotebook={deleteNotebook}
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
            <FocusPanel
              activeSession={focus.activeSession}
              isExpired={focus.isExpired}
              onCompleteTodo={focus.completeTodo}
              onEndFocus={focus.endFocus}
              onOpenFocus={focus.openOverlay}
              onStartFocus={focus.startFocus}
              progress={focus.progress}
              recommendedBlock={data.recommendedBlock}
              recommendedTodos={data.recommendedTodos}
              remainingSeconds={focus.remainingSeconds}
            />
          </div>
        </div>
      )}

      <DashboardModals
        activeModal={activeModal}
        folderTitle={folderTitle}
        folders={data.folders}
        notebooks={data.notebooks}
        notebookTitle={notebookTitle}
        onClose={closeModal}
        onFolderTitleChange={setFolderTitle}
        onNotebookTitleChange={setNotebookTitle}
        onSelectedFolderChange={setSelectedFolder}
        onSubmitFolder={submitFolder}
        onSubmitNotebook={submitNotebook}
        onSubmitTodo={submitTodo}
        onTodoFormChange={setTodoForm}
        selectedFolder={selectedFolder}
        todoForm={todoForm}
      />
    </main>
  )
}

export default Dashboard
