import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, getUser, logout } from '../utils/api'

// Priority label colors
const PRIORITY_COLORS = {
  HIGH: { bg: '#FEE2E2', color: '#DC2626' },
  MEDIUM: { bg: '#FEF9C3', color: '#92400E' },
  LOW: { bg: '#DCFCE7', color: '#166534' },
}

function Dashboard() {
  const [todos, setTodos] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddTodo, setShowAddTodo] = useState(false)
  const [newTodo, setNewTodo] = useState({ title: '', deadline: '', academic_weight: 5, estimated_effort: 5 })
  const [addingTodo, setAddingTodo] = useState(false)
  const navigate = useNavigate()
  const user = getUser()

  useEffect(() => {
    if (!user) { navigate('/'); return }
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [todosData, notesData] = await Promise.all([
        api.getTodos({ limit: 20 }),
        api.getNotes(),
      ])
      setTodos(todosData.todos || [])
      setNotes(notesData.notes || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleComplete(id) {
    try {
      await api.completeTodo(id)
      setTodos(prev => prev.map(t => t.id === id ? { ...t, is_completed: 1 } : t))
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDeleteTodo(id) {
    try {
      await api.deleteTodo(id)
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  async function handleAddTodo(e) {
    e.preventDefault()
    setAddingTodo(true)
    try {
      await api.createTodo(newTodo)
      setNewTodo({ title: '', deadline: '', academic_weight: 5, estimated_effort: 5 })
      setShowAddTodo(false)
      loadData()
    } catch (err) {
      console.error(err)
    } finally {
      setAddingTodo(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  const filteredTodos = todos.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  // Group todos by today vs upcoming for "Your Day" sidebar
  const today = new Date().toDateString()
  const todayTodos = todos.filter(t => {
    if (!t.deadline) return false
    return new Date(t.deadline).toDateString() === today
  })

  // Notebooks from notes (group by folder concept — using todo link for now)
  const linkedNotebooks = [
    { id: 'discrete-math', title: 'Discrete Math', noteCount: notes.filter(n => n.title?.toLowerCase().includes('discrete')).length },
    { id: 'all-notes', title: 'All Notes', noteCount: notes.length },
  ]

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <img src="/favicon.svg" alt="Notable" width={28} height={28} />
          <span style={styles.navBrand}>Notable</span>
        </div>
        <div style={styles.navCenter}>
          <div style={styles.searchBar}>
            <span style={{ color: '#AAA', fontSize: 13 }}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <span style={{ cursor: 'pointer', color: '#AAA', fontSize: 12 }} onClick={() => setSearch('')}>✕</span>
            )}
          </div>
        </div>
        <div style={styles.navRight}>
          <button style={styles.navBtn} onClick={() => navigate('/notebook')}>Notebook</button>
          <button style={styles.navBtnPrimary} onClick={handleLogout}>Log out</button>
        </div>
      </nav>

      {/* Main layout */}
      <div style={styles.layout}>
        {/* Main content */}
        <main style={styles.main}>
          <h1 style={styles.greeting}>
            Hello, {user?.display_name || user?.name || 'there'}
          </h1>

          {/* Notebooks grid */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Notebooks</h2>
              <button style={styles.addBtn} onClick={() => navigate('/notebook')}>+ New</button>
            </div>
            <div style={styles.notebookGrid}>
              {linkedNotebooks.map((nb) => (
                <Link key={nb.id} to="/notebook" style={styles.notebookCard}>
                  <div style={styles.notebookThumb}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16v16H4z" fill="#E8E4FF" rx="2"/>
                      <path d="M8 8h8M8 11h8M8 14h5" stroke="#863bff" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <strong style={styles.notebookName}>{nb.title}</strong>
                  <div style={styles.notebookCount}>{nb.noteCount} notes</div>
                </Link>
              ))}
              <button style={styles.newNotebookCard} onClick={() => navigate('/notebook')}>
                <span style={{ fontSize: 24, color: '#CCCCCC' }}>+</span>
                <span style={{ fontSize: 13, color: '#AAAAAA' }}>New Notebook</span>
              </button>
            </div>
          </section>

          {/* Tasks section */}
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Tasks</h2>
              <button style={styles.addBtn} onClick={() => setShowAddTodo(!showAddTodo)}>+ Add Task</button>
            </div>

            {/* Add todo form */}
            {showAddTodo && (
              <form onSubmit={handleAddTodo} style={styles.addTodoForm}>
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo(p => ({ ...p, title: e.target.value }))}
                  required
                  style={styles.formInput}
                />
                <input
                  type="date"
                  value={newTodo.deadline}
                  onChange={(e) => setNewTodo(p => ({ ...p, deadline: e.target.value }))}
                  required
                  style={styles.formInput}
                />
                <div style={styles.sliderRow}>
                  <label style={styles.sliderLabel}>
                    Academic weight: <strong>{newTodo.academic_weight}</strong>
                    <input type="range" min="1" max="10" value={newTodo.academic_weight}
                      onChange={(e) => setNewTodo(p => ({ ...p, academic_weight: Number(e.target.value) }))}
                      style={{ marginLeft: 8, width: 100 }} />
                  </label>
                  <label style={styles.sliderLabel}>
                    Effort: <strong>{newTodo.estimated_effort}</strong>
                    <input type="range" min="1" max="10" value={newTodo.estimated_effort}
                      onChange={(e) => setNewTodo(p => ({ ...p, estimated_effort: Number(e.target.value) }))}
                      style={{ marginLeft: 8, width: 100 }} />
                  </label>
                </div>
                <div style={styles.formActions}>
                  <button type="submit" style={styles.addBtn} disabled={addingTodo}>
                    {addingTodo ? 'Adding...' : 'Add'}
                  </button>
                  <button type="button" style={styles.cancelBtn} onClick={() => setShowAddTodo(false)}>Cancel</button>
                </div>
              </form>
            )}

            {loading ? (
              <div style={styles.loadingText}>Loading tasks...</div>
            ) : filteredTodos.length === 0 ? (
              <div style={styles.emptyText}>
                {search ? `No tasks matching "${search}"` : 'No tasks yet. Add your first task!'}
              </div>
            ) : (
              <div style={styles.taskList}>
                {filteredTodos.map((todo) => {
                  const priority = todo.priority_label || 'LOW'
                  const pc = PRIORITY_COLORS[priority]
                  return (
                    <div key={todo.id} style={{
                      ...styles.taskCard,
                      opacity: todo.is_completed ? 0.5 : 1,
                    }}>
                      <button
                        style={{
                          ...styles.taskCheckbox,
                          backgroundColor: todo.is_completed ? '#863bff' : 'transparent',
                          borderColor: todo.is_completed ? '#863bff' : '#D1D5DB',
                        }}
                        onClick={() => !todo.is_completed && handleComplete(todo.id)}
                        title={todo.is_completed ? 'Completed' : 'Mark complete'}
                      >
                        {todo.is_completed && (
                          <svg width="10" height="10" viewBox="0 0 10 10">
                            <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        )}
                      </button>

                      <div style={styles.taskBody}>
                        <div style={styles.taskTitle}>{todo.title}</div>
                        {todo.deadline && (
                          <div style={styles.taskMeta}>
                            Due: {new Date(todo.deadline).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        )}
                      </div>

                      <div style={styles.taskRight}>
                        <span style={{ ...styles.priorityBadge, backgroundColor: pc.bg, color: pc.color }}>
                          {priority}
                        </span>
                        {todo.bhps_score !== undefined && (
                          <span style={styles.bhpsScore}>{todo.bhps_score}</span>
                        )}
                        {!todo.is_completed && (
                          <button style={styles.deleteBtn} onClick={() => handleDeleteTodo(todo.id)} title="Delete">✕</button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </main>

        {/* Right sidebar */}
        <aside style={styles.sidebar}>
          {/* Your Day */}
          <div style={styles.sideSection}>
            <h2 style={styles.sideSectionTitle}>Your Day</h2>
            {todayTodos.length === 0 ? (
              <p style={styles.sideEmptyText}>Nothing due today 🎉</p>
            ) : (
              todayTodos.map(t => (
                <div key={t.id} style={styles.dayItem}>
                  <div style={styles.dayDot} />
                  <div>
                    <div style={styles.dayTaskName}>{t.title}</div>
                    <div style={styles.dayTaskMeta}>Due today</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Timeline */}
          <div style={styles.sideSection}>
            <div style={styles.sideSectionHeader}>
              <h2 style={styles.sideSectionTitle}>Timeline</h2>
              <button style={styles.sideAddBtn} onClick={() => setShowAddTodo(true)}>+</button>
            </div>
            {todos.slice(0, 6).map(t => {
              const date = t.deadline ? new Date(t.deadline) : null
              return (
                <div key={t.id} style={styles.timelineItem}>
                  <div style={{ ...styles.timelineCircle, borderColor: t.is_completed ? '#863bff' : '#BBBBBB' }}>
                    {t.is_completed && <div style={styles.timelineDot} />}
                  </div>
                  <div style={styles.timelineBody}>
                    <div style={styles.timelineTaskName}>{t.title}</div>
                    {date && (
                      <div style={styles.timelineTaskMeta}>
                        {date.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}

const styles = {
  page: {
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
    backgroundColor: '#F9F9F9',
    color: '#1A1A1A',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    gap: 16,
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  navBrand: {
    fontFamily: "'Inria Sans', sans-serif",
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 700,
    color: '#863bff',
  },
  navCenter: {
    flex: 1,
    maxWidth: 360,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    border: '1px solid #D0D0D0',
    borderRadius: 6,
    padding: '5px 10px',
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: 13,
    width: '100%',
    backgroundColor: 'transparent',
    color: '#1A1A1A',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  navBtn: {
    background: 'none',
    border: '1px solid #E5E5E5',
    borderRadius: 6,
    padding: '6px 14px',
    fontSize: 13,
    cursor: 'pointer',
    color: '#1A1A1A',
    fontFamily: "'Inter', sans-serif",
  },
  navBtnPrimary: {
    background: '#0D1B2A',
    border: 'none',
    borderRadius: 6,
    padding: '6px 14px',
    fontSize: 13,
    cursor: 'pointer',
    color: '#FFFFFF',
    fontFamily: "'Inter', sans-serif",
  },
  layout: {
    display: 'flex',
    height: 'calc(100vh - 52px)',
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px 32px 32px 32px',
  },
  greeting: {
    fontFamily: "'Inria Sans', sans-serif",
    fontSize: 32,
    fontStyle: 'italic',
    fontWeight: 400,
    color: '#0D1B2A',
    marginBottom: 32,
    marginTop: 0,
  },
  section: {
    marginBottom: 36,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "'Inria Sans', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: '#0D1B2A',
    margin: 0,
  },
  addBtn: {
    background: '#0D1B2A',
    border: 'none',
    borderRadius: 6,
    padding: '6px 14px',
    fontSize: 12,
    cursor: 'pointer',
    color: '#FFFFFF',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
  },
  cancelBtn: {
    background: 'none',
    border: '1px solid #E5E5E5',
    borderRadius: 6,
    padding: '6px 14px',
    fontSize: 12,
    cursor: 'pointer',
    color: '#666',
    fontFamily: "'Inter', sans-serif",
  },
  notebookGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: 12,
  },
  notebookCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '16px 12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: 10,
    textDecoration: 'none',
    color: '#1A1A1A',
    cursor: 'pointer',
    transition: 'box-shadow 0.15s, border-color 0.15s',
  },
  notebookThumb: {
    width: 48,
    height: 48,
    backgroundColor: '#F0EBFF',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notebookName: {
    fontSize: 13,
    fontWeight: 600,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  notebookCount: {
    fontSize: 11,
    color: '#888',
  },
  newNotebookCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '16px 12px',
    backgroundColor: '#FAFAFA',
    border: '1px dashed #DDDDDD',
    borderRadius: 10,
    cursor: 'pointer',
    background: 'none',
    minHeight: 100,
    justifyContent: 'center',
  },
  addTodoForm: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  formInput: {
    padding: '8px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: 6,
    fontSize: 13,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#FAFAFA',
  },
  sliderRow: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
  },
  formActions: {
    display: 'flex',
    gap: 8,
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: 8,
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  taskCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: 8,
    padding: '12px 16px',
    transition: 'box-shadow 0.15s',
  },
  taskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '1.5px solid #D1D5DB',
    flexShrink: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    padding: 0,
  },
  taskBody: {
    flex: 1,
    minWidth: 0,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#1A1A1A',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  taskMeta: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  taskRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  priorityBadge: {
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 20,
    letterSpacing: '0.05em',
  },
  bhpsScore: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 12,
    color: '#D1D5DB',
    padding: '2px 4px',
    lineHeight: 1,
  },
  // Right sidebar
  sidebar: {
    width: 280,
    flexShrink: 0,
    borderLeft: '1px solid #E5E5E5',
    backgroundColor: '#FFFFFF',
    overflowY: 'auto',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  sideSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  sideSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideSectionTitle: {
    fontFamily: "'Inria Sans', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: '#0D1B2A',
    margin: 0,
  },
  sideAddBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 20,
    color: '#9CA3AF',
    lineHeight: 1,
    padding: 0,
  },
  sideEmptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    margin: 0,
  },
  dayItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#863bff',
    flexShrink: 0,
    marginTop: 5,
  },
  dayTaskName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#1A1A1A',
  },
  dayTaskMeta: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  timelineItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  },
  timelineCircle: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    border: '1.5px solid #BBBBBB',
    flexShrink: 0,
    marginTop: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#863bff',
  },
  timelineBody: {
    flex: 1,
  },
  timelineTaskName: {
    fontSize: 12,
    fontWeight: 500,
    color: '#1A1A1A',
    lineHeight: 1.4,
  },
  timelineTaskMeta: {
    fontSize: 11,
    color: '#9CA3AF',
  },
}

export default Dashboard