import { formatTime } from '../../../utils/date'
import { NOTEBOOK_MODAL } from '../hooks/useNotebook'

function NotebookTimelinePanel({
  groupedTodos,
  notebookTitle,
  onCompleteTodo,
  onDeleteTodo,
  onOpenModal,
}) {
  const groups = Object.entries(groupedTodos)

  return (
    <div className="notebook-panel">
      <div className="notebook-panel-header">
        <h2>Timeline</h2>
        <button
          aria-label="Create note"
          className="plus-btn"
          onClick={() => onOpenModal(NOTEBOOK_MODAL.NOTE)}
          type="button"
        >
          +
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="muted notebook-panel__empty">No tasks.</p>
      ) : (
        <div className="notebook-panel__scroller">
          {groups.map(([date, todos]) => (
            <div key={date}>
              <div className="date-header">{date}</div>
              {todos.map((todo) => (
                <article
                  className={`pill-card pill-card--task${todo.is_completed ? ' pill-card--completed' : ''}`}
                  key={todo.id}
                >
                  <button
                    aria-label={todo.is_completed ? `${todo.title} completed` : `Mark ${todo.title} complete`}
                    className="pill-card__check"
                    disabled={todo.is_completed === 1}
                    onClick={() => onCompleteTodo(todo.id)}
                    type="button"
                  />
                  <div className="pill-card__copy">
                    <p className="pill-card-title">{todo.title}</p>
                    <p className="pill-card-subtitle">{formatTime(todo.deadline)}</p>
                  </div>
                  <span className="pill-card-meta">{notebookTitle || 'This notebook'}</span>
                  <button
                    aria-label={`Delete ${todo.title}`}
                    className="pill-card__delete"
                    onClick={() => onDeleteTodo(todo.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotebookTimelinePanel
