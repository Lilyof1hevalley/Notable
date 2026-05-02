import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ── Sample Data ───────────────────────────────────────────────────────────────
const initialNotebooks = [
  { id: 'discrete-math', title: 'Discrete Math', noteCount: 12, color: '#F0EBFF' },
  { id: 'physics', title: 'Physics', noteCount: 8, color: '#EBF4FF' },
  { id: 'calculus', title: 'Calculus', noteCount: 15, color: '#EBFFF0' },
  { id: 'software-eng', title: 'Software Eng', noteCount: 6, color: '#FFF8EB' },
]

const initialTimeline = [
  { id: 1, name: 'Review Chapter 3', time: '08:00', folder: 'Discrete Math', done: false, date: '25 Mar 2026' },
  { id: 2, name: 'Submit Lab Report', time: '10:00', folder: 'Physics', done: false, date: '25 Mar 2026' },
  { id: 3, name: 'Quiz Preparation', time: '09:00', folder: 'Calculus', done: true, date: '26 Mar 2026' },
  { id: 4, name: 'Group Meeting', time: '13:00', folder: 'Software Eng', done: false, date: '26 Mar 2026' },
]

const COLORS = ['#F0EBFF', '#EBF4FF', '#EBFFF0', '#FFF8EB', '#FFE8E8', '#E8F8FF', '#F5F5F5', '#FFF0F8']

// ── Add Notebook Modal ────────────────────────────────────────────────────────
function AddNotebookModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [color, setColor] = useState(COLORS[0])

  const submit = () => {
    if (!title.trim()) return
    onAdd({ id: Date.now().toString(), title: title.trim(), noteCount: 0, color })
    onClose()
  }

  return (
    <div style={modal.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={modal.box}>
        <div style={modal.header}>
          <h2 style={modal.title}>New Notebook</h2>
          <button style={modal.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={modal.form}>
          <div style={modal.field}>
            <label style={modal.label}>TITLE</label>
            <input
              autoFocus
              style={modal.input}
              placeholder="e.g. Linear Algebra"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose() }}
            />
          </div>
          <div style={modal.field}>
            <label style={modal.label}>COLOUR</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => setColor(c)} style={{
                  width: 24, height: 24, borderRadius: '50%',
                  backgroundColor: c, cursor: 'pointer',
                  border: color === c ? '2px solid #1a1a1a' : '2px solid transparent',
                  transform: color === c ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 0.1s, border-color 0.1s',
                }} />
              ))}
            </div>
          </div>
          <div style={modal.actions}>
            <button style={modal.cancelBtn} onClick={onClose}>Cancel</button>
            <button style={{ ...modal.submitBtn, opacity: title.trim() ? 1 : 0.4 }} onClick={submit}>ADD NOTEBOOK</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Add Task Modal ────────────────────────────────────────────────────────────
function AddTaskModal({ onClose, onAdd, notebooks }) {
  const [name, setName] = useState('')
  const [time, setTime] = useState('09:00')
  const [folder, setFolder] = useState(notebooks[0]?.title || '')

  const submit = () => {
    if (!name.trim()) return
    onAdd({ id: Date.now(), name: name.trim(), time, folder, done: false, date: '25 Mar 2026' })
    onClose()
  }

  return (
    <div style={modal.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={modal.box}>
        <div style={modal.header}>
          <h2 style={modal.title}>Add Task</h2>
          <button style={modal.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={modal.form}>
          <div style={modal.field}>
            <label style={modal.label}>TASK NAME</label>
            <input
              autoFocus
              style={modal.input}
              placeholder="e.g. Review Chapter 4"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose() }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ ...modal.field, flex: 1 }}>
              <label style={modal.label}>TIME</label>
              <input type="time" style={modal.input} value={time} onChange={e => setTime(e.target.value)} />
            </div>
            <div style={{ ...modal.field, flex: 1 }}>
              <label style={modal.label}>NOTEBOOK</label>
              <select style={{ ...modal.input, cursor: 'pointer' }} value={folder} onChange={e => setFolder(e.target.value)}>
                {notebooks.map(n => <option key={n.id}>{n.title}</option>)}
              </select>
            </div>
          </div>
          <div style={modal.actions}>
            <button style={modal.cancelBtn} onClick={onClose}>Cancel</button>
            <button style={{ ...modal.submitBtn, opacity: name.trim() ? 1 : 0.4 }} onClick={submit}>ADD TASK</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [notebooks, setNotebooks] = useState(initialNotebooks)
  const [timeline, setTimeline] = useState(initialTimeline)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [showAddNotebook, setShowAddNotebook] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [sortBy, setSortBy] = useState('default')
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef(null)

  useEffect(() => {
    const h = e => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  let displayed = notebooks.filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
  if (sortBy === 'name-asc') displayed = [...displayed].sort((a, b) => a.title.localeCompare(b.title))
  else if (sortBy === 'name-desc') displayed = [...displayed].sort((a, b) => b.title.localeCompare(a.title))
  else if (sortBy === 'notes-desc') displayed = [...displayed].sort((a, b) => b.noteCount - a.noteCount)
  else if (sortBy === 'notes-asc') displayed = [...displayed].sort((a, b) => a.noteCount - b.noteCount)

  const timelineGroups = Object.entries(
    timeline.reduce((acc, t) => {
      if (!acc[t.date]) acc[t.date] = []
      acc[t.date].push(t)
      return acc
    }, {})
  )

  const toggleTask = id => setTimeline(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))

  return (
    <div style={styles.page}>
      {showAddNotebook && (
        <AddNotebookModal onClose={() => setShowAddNotebook(false)} onAdd={nb => setNotebooks(p => [...p, nb])} />
      )}
      {showAddTask && (
        <AddTaskModal onClose={() => setShowAddTask(false)} notebooks={notebooks} onAdd={task => setTimeline(p => [...p, task])} />
      )}

      {/* ── Navbar ── */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <span style={styles.navTitle}>Notable</span>
        </div>
        <div style={styles.navRight}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>⌕</span>
            <input
              style={styles.searchInput}
              placeholder="Search notebooks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button style={styles.searchClear} onClick={() => setSearch('')}>✕</button>}
          </div>
          <div ref={sortRef} style={{ position: 'relative' }}>
            <button style={styles.iconBtn} onClick={() => setSortOpen(o => !o)} title="Sort">↕</button>
            {sortOpen && (
              <div style={styles.dropdownMenu}>
                <div style={styles.dropdownLabel}>Sort By</div>
                {[
                  { v: 'default', l: 'Default' },
                  { v: 'name-asc', l: 'Name A → Z' },
                  { v: 'name-desc', l: 'Name Z → A' },
                  { v: 'notes-desc', l: 'Most Notes First' },
                  { v: 'notes-asc', l: 'Fewest Notes First' },
                ].map(o => (
                  <button key={o.v} style={{
                    ...styles.dropdownItem,
                    background: sortBy === o.v ? '#F5F4F1' : 'none',
                    fontWeight: sortBy === o.v ? 600 : 400,
                  }} onClick={() => { setSortBy(o.v); setSortOpen(false) }}>
                    {sortBy === o.v && <span style={{ fontSize: 10, minWidth: 10 }}>✓</span>}
                    <span>{o.l}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={styles.body}>

        {/* ── Sidebar ── */}
        <aside style={styles.sidebar}>

          <button style={styles.focusBtn} onClick={() => navigate('/focus')}>
            <span>◎</span><span>Start Focus Session</span>
          </button>

          <div style={styles.sideSection}>
            <div style={styles.sideHead}>
              <span style={styles.sideTitle}>Timeline</span>
              <button style={styles.sideAddBtn} onClick={() => setShowAddTask(true)}>+</button>
            </div>
            {timelineGroups.map(([date, tasks]) => (
              <div key={date} style={styles.dateGroup}>
                <div style={styles.dateLabel}>{date}</div>
                {tasks.map(task => (
                  <div key={task.id} style={styles.taskItem} onClick={() => toggleTask(task.id)}>
                    <div style={{
                      ...styles.taskCircle,
                      ...(task.done ? { backgroundColor: '#1a1a1a', borderColor: '#1a1a1a' } : {}),
                    }}>
                      {task.done && (
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div style={{ ...styles.taskName, ...(task.done ? { textDecoration: 'line-through', color: '#bbb' } : {}) }}>
                        {task.name}
                      </div>
                      <div style={styles.taskMeta}>{task.time} · {task.folder}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Your Day */}
          <div style={styles.sideSection}>
            <div style={styles.sideHead}>
              <span style={styles.sideTitle}>Your Day</span>
            </div>
            {timeline.filter(t => t.date === '25 Mar 2026' && !t.done).length === 0 ? (
              <div style={{ fontSize: 12, color: '#bbb', fontStyle: 'italic' }}>All tasks done today 🎉</div>
            ) : (
              timeline.filter(t => t.date === '25 Mar 2026' && !t.done).map(t => (
                <div key={t.id} style={styles.yourDayItem}>
                  <span style={styles.yourDayTime}>{t.time}</span>
                  <span style={styles.yourDayName}> — {t.name}</span>
                </div>
              ))
            )}
          </div>

        </aside>

        {/* ── Main ── */}
        <main style={styles.main}>
          <h1 style={styles.greeting}>Hello, Nadira</h1>

          <div style={styles.sectionRow}>
            <span style={styles.sectionTitle}>Notebooks</span>
            <button style={styles.sideAddBtn} onClick={() => setShowAddNotebook(true)}>+</button>
          </div>

          {displayed.length === 0 ? (
            <div style={styles.empty}>
              {search ? `No notebooks matching "${search}"` : 'No notebooks yet.'}
            </div>
          ) : (
            <div style={styles.grid}>
              {displayed.map(nb => (
                <Link
                  key={nb.id}
                  to="/notebook"
                  style={{
                    ...styles.notebookCard,
                    boxShadow: hoveredCard === nb.id ? '0 4px 20px rgba(0,0,0,0.09)' : '0 1px 4px rgba(0,0,0,0.04)',
                    borderColor: hoveredCard === nb.id ? '#C8C4BE' : '#E8E6E2',
                  }}
                  onMouseEnter={() => setHoveredCard(nb.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{ ...styles.cardDot, backgroundColor: nb.color, marginBottom: 12 }} />
                  <div style={styles.cardTitle}>{nb.title}</div>
                  <div style={styles.cardMeta}>{nb.noteCount} notes</div>
                </Link>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '100vh',
    backgroundColor: '#F5F4F1',
    color: '#1a1a1a',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: 54,
    backgroundColor: '#fff',
    borderBottom: '1px solid #E8E6E2',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    gap: 16,
  },
  navLeft: { display: 'flex', alignItems: 'center' },
  navTitle: {
    fontFamily: "'Georgia', serif",
    fontStyle: 'italic',
    fontSize: 18,
    fontWeight: 400,
    color: '#1a1a1a',
  },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F5F4F1',
    borderRadius: 8,
    padding: '0 12px',
    height: 34,
    gap: 6,
    width: 200,
  },
  searchIcon: { fontSize: 17, color: '#bbb', lineHeight: 1 },
  searchInput: {
    flex: 1, border: 'none', background: 'transparent',
    outline: 'none', fontSize: 13, color: '#1a1a1a',
    fontFamily: "'Inter', sans-serif",
  },
  searchClear: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#bbb', padding: 0 },
  iconBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 16, color: '#555', padding: '4px 6px', borderRadius: 4,
  },
  dropdownMenu: {
    position: 'absolute', top: '100%', right: 0, marginTop: 4,
    backgroundColor: '#fff', border: '1px solid #E8E6E2',
    borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    minWidth: 175, zIndex: 300, overflow: 'hidden',
  },
  dropdownLabel: {
    padding: '6px 14px 4px', fontSize: 10, fontWeight: 600,
    letterSpacing: '0.06em', color: '#bbb', textTransform: 'uppercase',
  },
  dropdownItem: {
    padding: '9px 14px', fontSize: 13, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8, color: '#1a1a1a',
    border: 'none', width: '100%', textAlign: 'left',
    fontFamily: "'Inter', sans-serif", transition: 'background 0.1s',
  },
  body: { display: 'flex', height: 'calc(100vh - 54px)', overflow: 'hidden' },
  sidebar: {
    width: 252, flexShrink: 0,
    borderRight: '1px solid #E8E6E2', backgroundColor: '#fff',
    overflowY: 'auto', padding: '20px 16px',
    display: 'flex', flexDirection: 'column', gap: 28,
  },
  focusBtn: {
    width: '100%', padding: '10px 12px',
    backgroundColor: '#1a1a1a', color: '#fff',
    border: 'none', borderRadius: 7, fontSize: 12,
    fontWeight: 600, cursor: 'pointer',
    fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em',
    textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8,
  },
  sideSection: {},
  sideHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sideTitle: {
    fontFamily: "'Georgia', serif", fontStyle: 'italic',
    fontSize: 14, color: '#1a1a1a', fontWeight: 400,
  },
  sideAddBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 18, color: '#ccc', padding: 0, lineHeight: 1,
  },
  dateGroup: { marginBottom: 12 },
  dateLabel: {
    fontSize: 10, fontWeight: 600, color: '#bbb',
    letterSpacing: '0.08em', marginBottom: 6, textTransform: 'uppercase',
  },
  taskItem: {
    display: 'flex', alignItems: 'flex-start', gap: 8,
    marginBottom: 7, cursor: 'pointer',
    padding: '4px 6px', borderRadius: 6, transition: 'background 0.12s',
  },
  taskCircle: {
    width: 12, height: 12, borderRadius: '50%',
    border: '1.5px solid #D0CCC6', flexShrink: 0, marginTop: 2,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  taskName: { fontSize: 12, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.4 },
  taskMeta: { fontSize: 11, color: '#bbb' },
  main: { flex: 1, overflowY: 'auto', padding: '28px 32px' },
  greeting: {
    fontFamily: "'Georgia', serif", fontStyle: 'italic',
    fontSize: 22, fontWeight: 400, color: '#1a1a1a', margin: '0 0 20px',
  },
  sectionRow: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14,
  },
  sectionTitle: { fontSize: 13, fontWeight: 600, letterSpacing: '0.02em', color: '#1a1a1a' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
    gap: 14,
  },
  notebookCard: {
    backgroundColor: '#fff', border: '1px solid #E8E6E2',
    borderRadius: 12, padding: '16px 18px',
    cursor: 'pointer', transition: 'box-shadow 0.15s, border-color 0.15s',
    textDecoration: 'none', color: '#1a1a1a', display: 'block',
  },
  cardDot: {
    width: 10, height: 10, borderRadius: '50%',
    flexShrink: 0, border: '1px solid rgba(0,0,0,0.06)',
  },
  cardTitle: {
    fontFamily: "'Georgia', serif", fontStyle: 'italic',
    fontSize: 13, fontWeight: 400, color: '#1a1a1a',
    marginBottom: 4,
  },
  cardMeta: { fontSize: 11, color: '#bbb', fontFamily: "'Inter', sans-serif" },
  yourDayItem: {
    paddingBottom: 5,
    borderBottom: '1px solid #EDEBE7',
    marginBottom: 5,
    fontSize: 12,
    lineHeight: 1.5,
  },
  yourDayTime: { fontWeight: 600, color: '#1a1a1a' },
  yourDayName: { color: '#555' },
  empty: {
    textAlign: 'center', color: '#bbb', fontSize: 14,
    padding: '60px 0', fontFamily: "'Georgia', serif", fontStyle: 'italic',
  },
}

// ── Modal styles ──────────────────────────────────────────────────────────────
const modal = {
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200, padding: 24, backdropFilter: 'blur(3px)',
  },
  box: {
    backgroundColor: '#F7F6F3', borderRadius: 18,
    padding: '36px 40px 32px', width: '100%', maxWidth: 480,
    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  title: {
    fontFamily: "'Georgia', serif", fontStyle: 'italic',
    fontSize: 24, fontWeight: 400, color: '#1a1a1a', margin: 0,
  },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 16, color: '#bbb', padding: '4px 6px', borderRadius: 6, lineHeight: 1,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#666',
  },
  input: {
    padding: '13px 16px', backgroundColor: '#EDEBE7',
    border: '1.5px solid transparent', borderRadius: 8,
    fontSize: 14, color: '#1a1a1a', outline: 'none',
    fontFamily: "'Inter', sans-serif",
    width: '100%', boxSizing: 'border-box',
  },
  actions: { display: 'flex', gap: 10, marginTop: 8 },
  cancelBtn: {
    flex: 1, background: 'none', border: '1.5px solid #E0DDD8',
    borderRadius: 8, padding: '13px 0', fontSize: 12, fontWeight: 600,
    cursor: 'pointer', color: '#888',
    fontFamily: "'Inter', sans-serif", letterSpacing: '0.08em',
  },
  submitBtn: {
    flex: 2, backgroundColor: '#1a1a1a', color: '#fff',
    border: 'none', borderRadius: 8, padding: '13px 0',
    fontSize: 12, fontWeight: 700, cursor: 'pointer',
    fontFamily: "'Inter', sans-serif", letterSpacing: '0.12em',
  },
}