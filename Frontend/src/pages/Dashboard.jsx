import { useNavigate } from 'react-router-dom'
import FeedbackBanner from '../components/ui/FeedbackBanner'
import CalendarPanel from '../features/dashboard/components/CalendarPanel'
import DashboardHeader from '../features/dashboard/components/DashboardHeader'
import DashboardModals from '../features/dashboard/components/DashboardModals'
import FocusPanel from '../features/dashboard/components/FocusPanel'
import FocusSummaryModal from '../features/dashboard/components/FocusSummaryModal'
import RemindersPanel from '../features/dashboard/components/RemindersPanel'
import TimelinePanel from '../features/dashboard/components/TimelinePanel'
import WorkspaceGrid from '../features/dashboard/components/WorkspaceGrid'
import { useDashboard } from '../features/dashboard/hooks/useDashboard'
import { useAuth } from '../lib/AuthContext'

function Dashboard() {
  const auth = useAuth()
  const navigate = useNavigate()
  const dashboard = useDashboard(auth)
  const {
    activeModal,
    activeSession,
    clearFocusSummary,
    closeModal,
    completeTodo,
    data,
    deleteNotebook,
    deleteTodo,
    endFocus,
    error,
    folderTitle,
    isLoading,
    isTimerMinimized,
    lastFocusSummary,
    message,
    notebookTitle,
    openModal,
    selectedFolder,
    search,
    reminderTodos,
    setFolderTitle,
    setIsTimerMinimized,
    setNotebookTitle,
    setSearch,
    setSelectedFolder,
    setSortMode,
    setStatusFilter,
    setTodoForm,
    setTypeFilter,
    sortMode,
    startFocus,
    statusFilter,
    submitFolder,
    submitNotebook,
    submitTodo,
    todoForm,
    typeFilter,
    visibleTimelineTodos,
    visibleWorkspaceItems,
  } = dashboard

  function logout() {
    auth.logout()
    navigate('/', { replace: true })
  }

  return (
    <main className="app-shell dashboard-page">
      <DashboardHeader
        onLogout={logout}
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
              activeSession={activeSession}
              isTimerMinimized={isTimerMinimized}
              onCompleteTodo={completeTodo}
              onEndFocus={endFocus}
              onMinimize={() => setIsTimerMinimized(true)}
              onRestore={() => setIsTimerMinimized(false)}
              onStartFocus={startFocus}
              recommendedBlock={data.recommendedBlock}
              recommendedTodos={data.recommendedTodos}
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
      <FocusSummaryModal
        onClose={clearFocusSummary}
        summary={lastFocusSummary}
      />
    </main>
  )
}

export default Dashboard
