import { useCallback, useEffect, useMemo, useState } from 'react'
import ProtectedTopbar from '../../../shared/components/ui/ProtectedTopbar'
import { formatTime } from '../../../utils/date'
import {
  formatBhpsScore,
  getFocusCue,
  getLoadMeta,
  getPriorityMeta,
} from '../../../utils/priority'
import { formatCountdown, useFocusSession } from '../FocusSessionContext'
import { getFocusRecommendations } from '../focus.api'

function getBhpsLabel(todo) {
  const priority = getPriorityMeta(todo)
  if (priority.tone === 'medium') return 'Moderate'
  return priority.label
}

function FocusTags({ block }) {
  if (!block) return null

  const topic = block.topic?.title || 'Today'
  const load = block.cognitive_load ? `${block.cognitive_load} load` : 'Focus block'

  return (
    <div className="focus-page-tags">
      <span>{block.duration_minutes || 50} min</span>
      <span>{load}</span>
      <span>{topic}</span>
    </div>
  )
}

function FocusSteps({ steps = [] }) {
  return (
    <div className="focus-page-step-list">
      {steps.map((step, index) => (
        <article className="focus-page-step" key={step.key || step.title}>
          <span>{index + 1}</span>
          <div>
            <strong>{step.title}</strong>
            <p>{step.detail}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

function FocusTasks({ onCompleteTodo, todos = [] }) {
  if (todos.length === 0) {
    return <p className="muted">No active tasks available for this block.</p>
  }

  return (
    <div className="focus-page-task-list">
      {todos.map((todo, index) => {
        const isComplete = todo.is_completed === 1
        const priority = getPriorityMeta(todo)
        const load = getLoadMeta(todo)
        const checkClass = isComplete ? 'focus-page-task__check is-complete' : 'focus-page-task__check'

        return (
          <article className={isComplete ? 'focus-page-task is-complete' : 'focus-page-task'} key={todo.id}>
            {onCompleteTodo ? (
              <button
                aria-label={isComplete ? `${todo.title} completed` : `Complete ${todo.title}`}
                className={checkClass}
                disabled={isComplete}
                onClick={() => onCompleteTodo(todo.id)}
                type="button"
              >
                {index + 1}
              </button>
            ) : (
              <span>{index + 1}</span>
            )}
            <div>
              <strong>{todo.title}</strong>
              <p>{formatTime(todo.deadline)} / {getFocusCue(todo)}</p>
              <div className="focus-page-badges">
                <span className={`focus-page-bhps focus-page-bhps--${priority.tone}`}>
                  {getBhpsLabel(todo)} {formatBhpsScore(todo)}
                </span>
                <span className={`focus-page-load focus-page-load--${load.tone}`}>
                  {load.label}
                </span>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function SupportGrid({
  notes = [],
  onDownloadResource,
  onOpenNote,
  resources = [],
}) {
  return (
    <div className="focus-page-support-grid">
      <section>
        <span>Notes</span>
        {notes.length > 0 ? notes.map((note) => (
          <button className="focus-page-support-link" key={note.id} onClick={() => onOpenNote?.(note)} type="button">
            {note.title}
          </button>
        )) : <p className="muted">No linked notes yet.</p>}
      </section>
      <section>
        <span>Resources</span>
        {resources.length > 0 ? resources.map((resource) => (
          <button
            className="focus-page-support-link"
            key={resource.id}
            onClick={() => onDownloadResource?.(resource)}
            type="button"
          >
            {resource.original_name}
          </button>
        )) : <p className="muted">No linked resources yet.</p>}
      </section>
    </div>
  )
}

function ActiveSession({
  activeSession,
  completeTodo,
  downloadSupportResource,
  endFocus,
  isExpired,
  openOverlay,
  openSupportNote,
  progress,
  remainingSeconds,
  supportContext,
}) {
  const todos = activeSession.todos || []
  const completedCount = todos.filter((todo) => todo.is_completed === 1).length
  const progressPercent = Math.round(progress * 100)
  const block = {
    cognitive_load: todos.length > 0 ? getLoadMeta(todos[0]).label : 'Focus',
    duration_minutes: activeSession.duration_minutes,
    topic: { title: activeSession.title || 'Focus block' },
  }

  return (
    <div className="focus-page-layout focus-page-layout--active">
      <section className={isExpired ? 'focus-page-timer-card is-expired' : 'focus-page-timer-card'}>
        <span>{isExpired ? "Time's up" : 'Now focusing'}</span>
        <h2>{formatCountdown(remainingSeconds)}</h2>
        <div className="focus-page-progress" aria-label={`${progressPercent}% elapsed`}>
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <p>{activeSession.title || 'Focus block'} / {completedCount} of {todos.length} tasks complete</p>
        <div className="focus-page-actions">
          <button className="ghost-button" onClick={openOverlay} type="button">Open Popup</button>
          <button onClick={() => endFocus(activeSession.id)} type="button">
            {isExpired ? 'Finish Session' : 'End Session'}
          </button>
        </div>
      </section>
      <section className="focus-page-card focus-page-card--span">
        <div className="focus-page-section-header">
          <h2>Session Context</h2>
          <FocusTags block={block} />
        </div>
        <p>{activeSession.session_notes || 'Keep this block narrow and finish the selected tasks first.'}</p>
      </section>
      <section className="focus-page-card">
        <div className="focus-page-section-header">
          <h2>Tasks</h2>
          <span>{completedCount}/{todos.length}</span>
        </div>
        <FocusTasks onCompleteTodo={completeTodo} todos={todos} />
      </section>
      <section className="focus-page-card">
        <div className="focus-page-section-header">
          <h2>Support</h2>
        </div>
        <SupportGrid
          notes={supportContext.notes}
          onDownloadResource={downloadSupportResource}
          onOpenNote={openSupportNote}
          resources={supportContext.resources}
        />
      </section>
    </div>
  )
}

function IdleSession({ block, error, isLoading, onPrepare }) {
  if (isLoading) {
    return <div className="notebook-loading">Loading focus recommendation...</div>
  }

  if (!block) {
    return (
      <div className="focus-page-layout">
        <section className="focus-page-hero focus-page-hero--empty">
          <div>
            <span>No focus block yet</span>
            <h2>Nothing urgent to focus on</h2>
            <p>{error || 'Add active tasks with deadlines and effort estimates to unlock BHPS recommendations.'}</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="focus-page-layout">
      <section className="focus-page-hero">
        <div>
          <span>Recommended focus block</span>
          <h2>{block.title}</h2>
          <p>Review this block before starting. {block.reason}</p>
          <FocusTags block={block} />
        </div>
        <button onClick={() => onPrepare(block)} type="button">Prepare Focus</button>
      </section>
      <section className="focus-page-card">
        <div className="focus-page-section-header">
          <h2>Study Sequence</h2>
        </div>
        <FocusSteps steps={block.steps} />
      </section>
      <section className="focus-page-card">
        <div className="focus-page-section-header">
          <h2>Priority Task</h2>
        </div>
        <FocusTasks todos={block.todos} />
      </section>
      <section className="focus-page-card focus-page-card--span">
        <div className="focus-page-section-header">
          <h2>Support Materials</h2>
        </div>
        <SupportGrid notes={block.notes} resources={block.resources} />
      </section>
    </div>
  )
}

export default function FocusSession() {
  const {
    activeSession,
    completeTodo,
    downloadSupportResource,
    endFocus,
    focusError,
    isExpired,
    openOverlay,
    openPrepareFocus,
    openSupportNote,
    progress,
    refreshFocus,
    remainingSeconds,
    supportContext,
  } = useFocusSession()
  const [recommendedBlock, setRecommendedBlock] = useState(null)
  const [recommendationError, setRecommendationError] = useState('')
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(true)

  const loadRecommendation = useCallback(async () => {
    setRecommendationError('')
    setIsLoadingRecommendation(true)
    try {
      const data = await getFocusRecommendations()
      setRecommendedBlock(data.recommended_block || null)
    } catch (err) {
      setRecommendationError(err.message)
    } finally {
      setIsLoadingRecommendation(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refreshFocus()
      loadRecommendation()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadRecommendation, refreshFocus])

  const title = useMemo(() => (
    activeSession ? formatCountdown(remainingSeconds) : 'Focus Session'
  ), [activeSession, remainingSeconds])

  const mergedError = focusError || recommendationError

  return (
    <main className="app-shell focus-page">
      <ProtectedTopbar
        backLabel="Back to Dashboard"
        backTo="/dashboard"
        className="focus-page-topbar"
        showSettings={false}
        title={title}
      />
      {mergedError && <div className="auth-error focus-page-error">{mergedError}</div>}
      {activeSession ? (
        <ActiveSession
          activeSession={activeSession}
          completeTodo={completeTodo}
          downloadSupportResource={downloadSupportResource}
          endFocus={endFocus}
          isExpired={isExpired}
          openOverlay={openOverlay}
          openSupportNote={openSupportNote}
          progress={progress}
          remainingSeconds={remainingSeconds}
          supportContext={supportContext}
        />
      ) : (
        <IdleSession
          block={recommendedBlock}
          error={recommendationError}
          isLoading={isLoadingRecommendation}
          onPrepare={openPrepareFocus}
        />
      )}
    </main>
  )
}
