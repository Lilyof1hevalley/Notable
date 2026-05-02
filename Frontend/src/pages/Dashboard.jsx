import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ── Sample Data ───────────────────────────────────────────────────────────────
const sampleNotebooks = [
  { id: 1, title: 'Discrete Math', type: 'folder', noteCount: 12 },
  { id: 2, title: 'Physics', type: 'notebook', noteCount: 8 },
  { id: 3, title: 'Calculus', type: 'notebook', noteCount: 15 },
  { id: 4, title: 'Software Eng', type: 'notebook', noteCount: 6 },
  { id: 5, title: 'Chemistry', type: 'folder', noteCount: 9 },
  { id: 6, title: 'Statistics', type: 'notebook', noteCount: 4 },
  { id: 7, title: 'Linear Algebra', type: 'notebook', noteCount: 11 },
  { id: 8, title: 'Data Structures', type: 'folder', noteCount: 7 },
]

const sampleYourDay = [
  { id: 1, title: 'All Day Event', location: 'Location', allDay: true },
  { id: 2, title: 'Event Name', time: '08:00 – 09:00', location: 'Location' },
  { id: 3, title: 'Event Name', time: '08:00 – 09:00', location: 'Location' },
  { id: 4, title: 'Event Name', time: '08:00 – 09:00', location: 'Location' },
  { id: 5, title: 'Event Name', time: '08:00 – 09:00', location: 'Location' },
]

const sampleTimeline = [
  {
    date: '25 Mar 2026',
    tasks: [
      { id: 1, name: 'Review Chapter 3', time: '08:00', folder: 'Folder/Notebook', done: false },
      { id: 2, name: 'Submit Lab Report', time: '09:00', folder: 'Folder/Notebook', done: false },
    ],
  },
  {
    date: '25 Mar 2026',
    tasks: [
      { id: 3, name: 'Quiz Preparation', time: '09:00', folder: 'Folder/Notebook', done: false },
      { id: 4, name: 'Group Meeting', time: '09:00', folder: 'Folder/Notebook', done: false },
    ],
  },
  {
    date: '25 Mar 2026',
    tasks: [
      { id: 5, name: 'Read Articles', time: '09:00', folder: 'Folder/Notebook', done: false },
      { id: 6, name: 'Project Review', time: '09:00', folder: 'Folder/Notebook', done: false },
    ],
  },
]

function NotebookThumb({ type }) {
  if (type === 'folder') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#E8E4DC" />
        <rect x="8" y="20" width="50" height="6" rx="1" fill="#C8C4BC" />
        <rect x="8" y="30" width="104" height="42" rx="3" fill="#D8D4CC" />
        <line x1="15" y1="45" x2="105" y2="45" stroke="#C0BDB5" strokeWidth="1.5" />
        <line x1="15" y1="55" x2="85" y2="55" stroke="#C0BDB5" strokeWidth="1.5" />
        <line x1="15" y1="65" x2="95" y2="65" stroke="#C0BDB5" strokeWidth="1.5" />
      </svg>
    )
  }
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="80" fill="#E8E4DC" />
      <rect x="8" y="8" width="104" height="64" rx="3" fill="#D8D4CC" />
      <line x1="15" y1="24" x2="105" y2="24" stroke="#C0BDB5" strokeWidth="1.5" />
      <line x1="15" y1="36" x2="105" y2="36" stroke="#C0BDB5" strokeWidth="1.5" />
      <line x1="15" y1="48" x2="85" y2="48" stroke="#C0BDB5" strokeWidth="1.5" />
      <line x1="15" y1="60" x2="95" y2="60" stroke="#C0BDB5" strokeWidth="1.5" />
      <line x1="8" y1="8" x2="8" y2="72" stroke="#B0ADA5" strokeWidth="4" />
    </svg>
  )
}

export default function Dashboard() {
  const [search, setSearch] = useState('')
  const [hoveredCard, setHoveredCard] = useState(null)
  const [tasks, setTasks] = useState(sampleTimeline)
  const navigate = useNavigate()

  const filteredNotebooks = sampleNotebooks.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase())
  )

  function toggleTask(dateIdx, taskId) {
    setTasks(prev => prev.map((group, i) =>
      i === dateIdx
        ? { ...group, tasks: group.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) }
        : group
    ))
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.greeting}>Hello, Nadira</h1>
        <div style={styles.headerRight}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <span style={styles.clearBtn} onClick={() => setSearch('')}>×</span>
            )}
          </div>
          <button style={styles.iconBtn} title="Filter">▽</button>
          <button style={styles.iconBtn} title="Sort">↕</button>
        </div>
      </header>

      <div style={styles.body}>
        <main style={styles.main}>
          {filteredNotebooks.length === 0 ? (
            <div style={styles.empty}>No notebooks found.</div>
          ) : (
            <div style={styles.grid}>
              {filteredNotebooks.map(nb => (
                <Link
                  key={nb.id}
                  to="/notebook"
                  style={{
                    ...styles.card,
                    boxShadow: hoveredCard === nb.id ? '0 4px 16px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.06)',
                    borderColor: hoveredCard === nb.id ? '#CCCCCC' : '#E5E5E5',
                  }}
                  onMouseEnter={() => setHoveredCard(nb.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={styles.cardThumb}>
                    <NotebookThumb type={nb.type} />
                  </div>
                  <div style={styles.cardInfo}>
                    <div style={styles.cardTitle}>{nb.title}</div>
                    <div style={styles.cardMeta}>
                      {nb.type === 'folder' ? 'Folder' : 'Notebook'} · {nb.noteCount} notes
                    </div>
                  </div>
                </Link>
              ))}
              <button
                style={styles.addCard}
                onClick={() => navigate('/notebook')}
                title="Add notebook"
              >
                <span style={styles.addCardPlus}>⊕</span>
              </button>
            </div>
          )}
        </main>

        <aside style={styles.sidebar}>
          <section style={styles.sideSection}>
            <h2 style={styles.sideTitle}>Your Day</h2>
            <div style={styles.dayList}>
              {sampleYourDay.map(ev => (
                <div key={ev.id} style={styles.dayItem}>
                  <div style={styles.dayDot} />
                  <div style={styles.dayBody}>
                    <div style={styles.dayEventName}>{ev.title}</div>
                    <div style={styles.dayEventMeta}>
                      {ev.allDay ? 'All Day' : ev.time} · {ev.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div style={styles.divider} />

          <section style={styles.sideSection}>
            <div style={styles.sideTitleRow}>
              <h2 style={styles.sideTitle}>Timeline</h2>
              <button style={styles.sideAddBtn} title="Add task">+</button>
            </div>
            <div style={styles.timelineList}>
              {tasks.map((group, gi) => (
                <div key={gi} style={styles.timelineGroup}>
                  <div style={styles.timelineDateLabel}>{group.date}</div>
                  {group.tasks.map(task => (
                    <div key={task.id} style={styles.timelineTask}>
                      <button
                        style={{
                          ...styles.taskCircle,
                          borderColor: task.done ? '#1A1A1A' : '#BBBBBB',
                          backgroundColor: task.done ? '#1A1A1A' : 'transparent',
                        }}
                        onClick={() => toggleTask(gi, task.id)}
                      />
                      <div style={styles.taskBodyDiv}>
                        <div style={{
                          ...styles.taskName,
                          textDecoration: task.done ? 'line-through' : 'none',
                          color: task.done ? '#AAAAAA' : '#1A1A1A',
                        }}>
                          {task.name}
                        </div>
                        <div style={styles.taskMeta}>{task.time} · {task.folder}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
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
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 24px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    gap: 16,
  },
  greeting: {
    fontFamily: "'Inria Sans', serif",
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '26px',
    color: '#1A1A1A',
    margin: 0,
    flexShrink: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    border: '1px solid #D0D0D0',
    borderRadius: '6px',
    padding: '5px 10px',
    backgroundColor: '#FFFFFF',
    width: 220,
  },
  searchIcon: { color: '#AAA', fontSize: 13 },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: 13,
    width: '100%',
    backgroundColor: 'transparent',
    color: '#1A1A1A',
    fontFamily: "'Inter', sans-serif",
  },
  clearBtn: {
    cursor: 'pointer',
    color: '#AAA',
    fontSize: 16,
    lineHeight: 1,
  },
  iconBtn: {
    background: 'none',
    border: '1px solid #E5E5E5',
    borderRadius: 6,
    padding: '5px 9px',
    cursor: 'pointer',
    fontSize: 13,
    color: '#555',
  },
  body: {
    display: 'flex',
    flex: 1,
    height: 'calc(100vh - 57px)',
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '16px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    transition: 'box-shadow 0.15s, border-color 0.15s',
  },
  cardThumb: {
    width: '100%',
    aspectRatio: '3/2',
    overflow: 'hidden',
    backgroundColor: '#E8E4DC',
  },
  cardInfo: {
    padding: '8px 10px 10px',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardMeta: {
    fontSize: '11px',
    color: '#888',
  },
  addCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1.5px dashed #D0D0D0',
    borderRadius: '8px',
    background: 'none',
    cursor: 'pointer',
    aspectRatio: 'unset',
    minHeight: 100,
    transition: 'border-color 0.15s',
  },
  addCardPlus: {
    fontSize: 28,
    color: '#CCCCCC',
    lineHeight: 1,
  },
  empty: {
    color: '#AAA',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 60,
  },
  sidebar: {
    width: 260,
    flexShrink: 0,
    borderLeft: '1px solid #E5E5E5',
    backgroundColor: '#FFFFFF',
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  sideSection: {
    marginBottom: 4,
  },
  sideTitle: {
    fontFamily: "'Inria Sans', serif",
    fontSize: '14px',
    fontWeight: '700',
    color: '#1A1A1A',
    margin: '0 0 10px 0',
  },
  sideTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sideAddBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 20,
    color: '#888',
    lineHeight: 1,
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    margin: '12px 0',
  },
  dayList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  dayItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    padding: '5px 0',
    borderBottom: '1px solid #F0F0F0',
  },
  dayDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#1A1A1A',
    flexShrink: 0,
    marginTop: 3,
  },
  dayBody: {},
  dayEventName: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#1A1A1A',
    lineHeight: 1.4,
  },
  dayEventMeta: {
    fontSize: '10px',
    color: '#888',
    marginTop: 1,
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  timelineGroup: {
    marginBottom: 4,
  },
  timelineDateLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#888',
    letterSpacing: '0.04em',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  timelineTask: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  taskCircle: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    border: '1.5px solid #BBBBBB',
    flexShrink: 0,
    marginTop: 2,
    cursor: 'pointer',
    padding: 0,
    transition: 'background-color 0.15s, border-color 0.15s',
  },
  taskBodyDiv: {},
  taskName: {
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: 1.4,
    transition: 'color 0.15s',
  },
  taskMeta: {
    fontSize: '10px',
    color: '#888',
    marginTop: 1,
  },
}