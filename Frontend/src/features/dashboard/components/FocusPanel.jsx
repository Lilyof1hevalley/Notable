import { formatTime } from '../../../utils/date'
import { formatBhpsScore, getFocusCue, getLoadMeta, getPriorityMeta } from '../../../utils/priority'

function FocusPanel({
  activeSession,
  isTimerMinimized,
  onCompleteTodo,
  onEndFocus,
  onMinimize,
  onRestore,
  onStartFocus,
  recommendedBlock,
  recommendedTodos,
}) {
  const recommendations = (recommendedTodos || []).slice(0, 3)
  const studyBlock = recommendedBlock || null
  const blockTodos = studyBlock?.todos?.length ? studyBlock.todos : recommendations
  const topTodo = blockTodos[0]
  const topPriority = topTodo ? getPriorityMeta(topTodo) : null
  const topLoad = topTodo ? getLoadMeta(topTodo) : null
  const sessionTodos = activeSession?.todos || []
  const startTodoIds = blockTodos.map((todo) => todo.id).filter(Boolean)
  const startedAt = activeSession
    ? new Date(activeSession.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <>
      <aside className="dashboard-panel dashboard-panel--focus">
        <div className="dashboard-panel__header">
          <h2>Focus Session</h2>
        </div>
        <div className="dashboard-panel__body focus-panel__body">
          {activeSession ? (
            <div className="focus-panel__content focus-panel__content--recommendations">
              <div>
                <strong>{activeSession.duration_minutes} min session</strong>
                <p>Started at {startedAt}. Keep this block contained and finish one step at a time.</p>
              </div>
              {sessionTodos.length > 0 && (
                <div className="focus-session-task-list" aria-label="Tasks in this focus session">
                  {sessionTodos.map((todo) => {
                    const priority = getPriorityMeta(todo)
                    const isComplete = todo.is_completed === 1

                    return (
                      <article className={isComplete ? 'focus-session-task is-complete' : 'focus-session-task'} key={todo.id}>
                        <button
                          aria-label={isComplete ? `${todo.title} completed` : `Complete ${todo.title}`}
                          className={isComplete ? 'focus-session-task__status is-complete' : 'focus-session-task__status'}
                          disabled={isComplete}
                          onClick={() => onCompleteTodo(todo.id)}
                          type="button"
                        />
                        <div>
                          <strong>{todo.title}</strong>
                          <p>{formatTime(todo.deadline)} / {getFocusCue(todo)}</p>
                        </div>
                        <span className={`priority-badge priority-badge--${priority.tone}`}>
                          {priority.label} {formatBhpsScore(todo)}
                        </span>
                      </article>
                    )
                  })}
                </div>
              )}
              <div className="focus-panel__actions">
                <button onClick={() => onEndFocus(activeSession.id)} type="button">
                  End Session
                </button>
                <button className="ghost-button" onClick={onMinimize} type="button">
                  Minimize
                </button>
              </div>
            </div>
          ) : (
            <div className="focus-panel__content focus-panel__content--recommendations">
              {topTodo ? (
                <>
                  <div>
                    <strong>{studyBlock?.title || `Start with ${topTodo.title}`}</strong>
                    <p className="muted">
                      {studyBlock?.reason || `BHPS picked this because it is ${topPriority.label.toLowerCase()} priority with a ${topLoad.label.toLowerCase()} load.`}
                    </p>
                  </div>
                  <div className="focus-block-summary">
                    <span>{studyBlock?.duration_minutes || 50} min</span>
                    <span>{studyBlock?.cognitive_load || topLoad.label} load</span>
                    <span>{studyBlock?.topic?.title || 'Today'}</span>
                  </div>
                  {studyBlock?.steps?.length > 0 && (
                    <div className="focus-step-list" aria-label="Recommended study sequence">
                      {studyBlock.steps.map((step, index) => (
                        <article className="focus-step" key={step.key || step.title}>
                          <span>{index + 1}</span>
                          <div>
                            <strong>{step.title}</strong>
                            <p>{step.detail}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                  <div className="focus-recommendation-list" aria-label="Recommended focus tasks">
                    {blockTodos.map((todo, index) => {
                      const priority = getPriorityMeta(todo)
                      const load = getLoadMeta(todo)

                      return (
                        <article className="focus-recommendation-card" key={todo.id}>
                          <span className="focus-recommendation-card__rank">{index + 1}</span>
                          <div className="focus-recommendation-card__main">
                            <strong>{todo.title}</strong>
                            <p>
                              {formatTime(todo.deadline)}
                              <span aria-hidden="true"> / </span>
                              {getFocusCue(todo)}
                            </p>
                          </div>
                          <div className="focus-recommendation-card__meta">
                            <span className={`priority-badge priority-badge--${priority.tone}`}>
                              {priority.label} {formatBhpsScore(todo)}
                            </span>
                            <span className={`load-badge load-badge--${load.tone}`}>{load.label}</span>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                  {(studyBlock?.notes?.length > 0 || studyBlock?.resources?.length > 0) && (
                    <div className="focus-support-grid">
                      {studyBlock.notes?.length > 0 && (
                        <div>
                          <strong>Notes</strong>
                          {studyBlock.notes.slice(0, 3).map((note) => (
                            <p key={note.id}>{note.title}</p>
                          ))}
                        </div>
                      )}
                      {studyBlock.resources?.length > 0 && (
                        <div>
                          <strong>Resources</strong>
                          {studyBlock.resources.slice(0, 3).map((resource) => (
                            <p key={resource.id}>{resource.original_name}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <button onClick={() => onStartFocus(startTodoIds)} type="button">
                    Start 50-min Focus
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <strong>No focus recommendation yet</strong>
                    <p className="muted">Add active tasks with deadlines and effort estimates to unlock BHPS recommendations.</p>
                  </div>
                  <button disabled type="button">
                    Start 50-min Focus
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </aside>

      {isTimerMinimized && activeSession && (
        <div className="floating-timer">
          <div className="header">
            <strong>Focus Session</strong>
            <button className="icon-button" onClick={onRestore} type="button">Open</button>
          </div>
          <p>{activeSession.duration_minutes}m session running since {startedAt}.</p>
          <div className="floating-timer__bar" aria-hidden="true">
            <span />
          </div>
          <button onClick={() => onEndFocus(activeSession.id)} type="button">End Session</button>
        </div>
      )}
    </>
  )
}

export default FocusPanel
