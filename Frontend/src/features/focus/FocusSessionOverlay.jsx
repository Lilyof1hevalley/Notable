import Modal from '../../shared/components/ui/Modal'
import { formatTime } from '../../utils/date'
import { formatBhpsScore, getFocusCue, getLoadMeta, getPriorityMeta } from '../../utils/priority'
import { formatCountdown, useFocusSession } from './FocusSessionContext'

function FocusSessionOverlay() {
  const {
    activeSession,
    closeOverlay,
    completeTodo,
    endFocus,
    isExpired,
    isOverlayOpen,
    progress,
    remainingSeconds,
    supportContext,
  } = useFocusSession()

  if (!activeSession) return null

  const todos = activeSession.todos || []
  const completedCount = todos.filter((todo) => todo.is_completed === 1).length
  const progressPercent = Math.round(progress * 100)

  return (
    <Modal
      isOpen={isOverlayOpen}
      onClose={closeOverlay}
      size="wide"
      title="Focus Session"
    >
      <section className={isExpired ? 'focus-overlay is-expired' : 'focus-overlay'}>
        <div className="focus-overlay__hero">
          <div>
            <span>{isExpired ? "Time's up" : 'Now focusing'}</span>
            <strong>{formatCountdown(remainingSeconds)}</strong>
            <p>{completedCount} of {todos.length} tasks complete</p>
          </div>
          <div className="focus-overlay__actions">
            <button className="ghost-button" onClick={closeOverlay} type="button">
              Minimize
            </button>
            <button onClick={() => endFocus(activeSession.id)} type="button">
              {isExpired ? 'Finish Session' : 'End Session'}
            </button>
          </div>
        </div>

        <div className="focus-overlay__progress" aria-label={`${progressPercent}% elapsed`}>
          <span style={{ width: `${progressPercent}%` }} />
        </div>

        {isExpired && (
          <div className="focus-overlay__notice">
            <strong>Focus block complete.</strong>
            <p>Finish the session for a summary, or minimize and keep working without resetting the block.</p>
          </div>
        )}

        <div className="focus-overlay__layout">
          <div className="focus-overlay__tasks" aria-label="Focus session tasks">
            {todos.map((todo, index) => {
              const priority = getPriorityMeta(todo)
              const load = getLoadMeta(todo)
              const isComplete = todo.is_completed === 1

              return (
                <article className={isComplete ? 'focus-overlay-task is-complete' : 'focus-overlay-task'} key={todo.id}>
                  <button
                    aria-label={isComplete ? `${todo.title} completed` : `Complete ${todo.title}`}
                    className={isComplete ? 'focus-overlay-task__check is-complete' : 'focus-overlay-task__check'}
                    disabled={isComplete}
                    onClick={() => completeTodo(todo.id)}
                    type="button"
                  >
                    {index + 1}
                  </button>
                  <div>
                    <strong>{todo.title}</strong>
                    <p>{formatTime(todo.deadline)} / {getFocusCue(todo)}</p>
                    <div className="focus-overlay-task__badges">
                      <span className={`priority-badge priority-badge--${priority.tone}`}>
                        {priority.label} {formatBhpsScore(todo)}
                      </span>
                      <span className={`load-badge load-badge--${load.tone}`}>{load.label}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <aside className="focus-overlay__support">
            <div>
              <h3>Notes</h3>
              {supportContext.notes.length > 0 ? (
                supportContext.notes.map((note) => <p key={note.id}>{note.title}</p>)
              ) : (
                <p className="muted">No linked notes for this focus block.</p>
              )}
            </div>
            <div>
              <h3>Resources</h3>
              {supportContext.resources.length > 0 ? (
                supportContext.resources.map((resource) => <p key={resource.id}>{resource.original_name}</p>)
              ) : (
                <p className="muted">No notebook resources linked yet.</p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </Modal>
  )
}

export default FocusSessionOverlay
