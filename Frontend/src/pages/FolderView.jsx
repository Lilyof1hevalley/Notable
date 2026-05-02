import { useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const initialNotebooks = [
  { id: 1, title: 'Lecture Notes', type: 'notebook', noteCount: 5, cover: null },
  { id: 2, title: 'Tutorial Notes', type: 'notebook', noteCount: 3, cover: null },
  { id: 3, title: 'Past Papers', type: 'notebook', noteCount: 8, cover: null },
  { id: 4, title: 'Assignments', type: 'notebook', noteCount: 4, cover: null },
  { id: 5, title: 'References', type: 'notebook', noteCount: 2, cover: null },
]

const sampleTimeline = [
  {
    date: '25 Mar 2026',
    tasks: [
      { id: 1, name: 'Review Chapter 3', time: '08:00', folder: 'Discrete Math', done: false },
      { id: 2, name: 'Submit Lab Report', time: '09:00', folder: 'Discrete Math', done: false },
    ],
  },
  {
    date: '26 Mar 2026',
    tasks: [
      { id: 3, name: 'Quiz Preparation', time: '09:00', folder: 'Discrete Math', done: false },
      { id: 4, name: 'Problem Set 2', time: '13:00', folder: 'Discrete Math', done: false },
    ],
  },
]

function DefaultThumb({ type }) {
  if (type === 'folder') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 120 80" fill="none">
        <rect width="120" height="80" fill="#EDE9E0" />
        <rect x="8" y="20" width="50" height="6" rx="2" fill="#C8C4BC" />
        <rect x="8" y="30" width="104" height="42" rx="3" fill="#D8D4CC" />
        <line x1="18" y1="46" x2="102" y2="46" stroke="#C0BDB5" strokeWidth="1.5" />
        <line x1="18" y1="56" x2="82" y2="56" stroke="#C0BDB5" strokeWidth="1.5" />
        <line x1="18" y1="65" x2="92" y2="65" stroke="#C0BDB5" strokeWidth="1.5" />
      </svg>
    )
  }
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 80" fill="none">
      <rect width="120" height="80" fill="#EDE9E0" />
      <rect x="14" y="8" width="98" height="64" rx="3" fill="#D8D4CC" />
      <line x1="22" y1="24" x2="104" y2="24" stroke="#C0BDB5" strokeWidth="1.5" />
      <line x1="22" y1="36" x2="104" y2="36" stroke="#C0BDB5" strokeWidth="1.5" />
      <line x1="22" y1="48" x2="84" y2="48" stroke="#C0BDB5" strokeWidth="1.5" />
      <line x1="22" y1="60" x2="94" y2="60" stroke="#C0BDB5" strokeWidth="1.5" />
      <rect x="8" y="8" width="6" height="64" rx="2" fill="#B0ADA5" />
    </svg>
  )
}

function NotebookCard({ nb, onCoverChange, hoveredCard, setHoveredCard }) {
  const fileRef = useRef()
  const [showUpload, setShowUpload] = useState(false)

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    onCoverChange(nb.id, URL.createObjectURL(file))
  }

  return (
    <div
      style={{
        ...styles.card,
        boxShadow: hoveredCard === nb.id ? '0 4px 16px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.05)',
        borderColor: hoveredCard === nb.id ? '#CCCCCC' : '#E5E5E5',
      }}
      onMouseEnter={() => { setHoveredCard(nb.id); setShowUpload(true) }}
      onMouseLeave={() => { setHoveredCard(null); setShowUpload(false) }}
    >
      <div style={styles.cardThumb}>
        {nb.cover
          ? <img src={nb.cover} alt={nb.title} style={styles.coverImg} />
          : <DefaultThumb type={nb.type} />
        }
        {showUpload && (
          <button style={styles.uploadOverlay} onClick={() => fileRef.current.click()}>
            <span style={{ fontSize: 18 }}>🖼</span>
            <span style={styles.uploadLabel}>{nb.cover ? 'Change cover' : 'Add cover'}</span>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>
      <Link to="/notebook" style={styles.cardInfo}>
        <div style={styles.cardTitle}>{nb.title}</div>
        <div style={styles.cardMeta}>Notebook · {nb.noteCount} notes</div>
      </Link>
    </div>
  )
}

export default function FolderView() {
  const { folderName = 'Discrete Math' } = useParams()
  const [search, setSearch] = useState('')
  const [hoveredCard, setHoveredCard] = useState(null)
  const [notebooks, setNotebooks] = useState(initialNotebooks)
  const [tasks, setTasks] = useState(sampleTimeline)
  const navigate = useNavigate()

  const filtered = notebooks.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase())
  )

  function handleCoverChange(id, url) {
    setNotebooks(prev => prev.map(n => n.id === id ? { ...n, cover: url } : n))
  }

  function toggleTask(gi, taskId) {
    setTasks(prev => prev.map((group, i) =>
      i === gi
        ? { ...group, tasks: group.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) }
        : group
    ))
  }

  return (
    <div style={styles.page}>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => navigate('/')}>←</button>
          <h1 style={styles.folderTitle}>{decodeURIComponent(folderName)}</h1>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.searchWrap}>
            <span style={{ color: '#AAA', fontSize: 13 }}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <span style={styles.clearBtn} onClick={() => setSearch('')}>×</span>}
          </div>
          <button style={styles.iconBtn} title="Filter">▽</button>
          <button style={styles.iconBtn} title="Sort">↕</button>
        </div>
      </header>

      {/* Body */}
      <div style={styles.body}>

        {/* Main grid */}
        <main style={styles.main}>
          {filtered.length === 0 ? (
            <div style={styles.empty}>No notebooks found.</div>
          ) : (
            <div style={styles.grid}>
              {filtered.map(nb => (
                <NotebookCard
                  key={nb.id}
                  nb={nb}
                  onCoverChange={handleCoverChange}
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                />
              ))}
              <button style={styles.addCard} onClick={() => {}}>
                <span style={{ fontSize: 26, color: '#CCCCCC' }}>⊕</span>
              </button>
            </div>
          )}
        </main>

        {/* Right sidebar */}
        <aside style={styles.sidebar}>
          <section style={styles.sideSection}>
            <div style={styles.sideTitleRow}>
              <h2 style={styles.sideTitle}>Timeline</h2>
              <button style={styles.sideAddBtn}>+</button>
            </div>
            {tasks.map((group, gi) => (
              <div key={gi} style={{ marginBottom: 10 }}>
                <div style={styles.dateLabel}>{group.date}</div>
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
                    <div>
                      <div style={{
                        ...styles.taskName,
                        textDecoration: task.done ? 'line-through' : 'none',
                        color: task.done ? '#AAAAAA' : '#1A1A1A',
                      }}>{task.name}</div>
                      <div style={styles.taskMeta}>{task.time} · {task.folder}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
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
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 24px', backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5', position: 'sticky', top: 0, zIndex: 100, gap: 16,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  backBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 18, color: '#555', padding: '2px 6px', lineHeight: 1,
  },
  folderTitle: {
    fontFamily: "'Inria Sans', serif",
    fontStyle: 'italic', fontWeight: 400, fontSize: 26,
    color: '#1A1A1A', margin: 0,
    textDecoration: 'underline', textUnderlineOffset: 3,
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: 10 },
  searchWrap: {
    display: 'flex', alignItems: 'center', gap: 6,
    border: '1px solid #D0D0D0', borderRadius: 6,
    padding: '5px 10px', backgroundColor: '#FFFFFF', width: 220,
  },
  searchInput: {
    border: 'none', outline: 'none', fontSize: 13,
    width: '100%', backgroundColor: 'transparent',
    color: '#1A1A1A', fontFamily: "'Inter', sans-serif",
  },
  clearBtn: { cursor: 'pointer', color: '#AAA', fontSize: 16, lineHeight: 1 },
  iconBtn: {
    background: 'none', border: '1px solid #E5E5E5',
    borderRadius: 6, padding: '5px 9px', cursor: 'pointer', fontSize: 13, color: '#555',
  },
  body: { display: 'flex', flex: 1, height: 'calc(100vh - 57px)', overflow: 'hidden' },
  main: { flex: 1, overflowY: 'auto', padding: '20px 24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: 16 },
  card: {
    display: 'flex', flexDirection: 'column',
    border: '1px solid #E5E5E5', borderRadius: 8,
    overflow: 'hidden', backgroundColor: '#FFFFFF',
    transition: 'box-shadow 0.15s, border-color 0.15s',
  },
  cardThumb: {
    width: '100%', aspectRatio: '3/2',
    position: 'relative', overflow: 'hidden', backgroundColor: '#EDE9E0',
  },
  coverImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  uploadOverlay: {
    position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 4, border: 'none', cursor: 'pointer',
  },
  uploadLabel: { fontSize: 11, color: '#FFFFFF', fontWeight: 600 },
  cardInfo: { padding: '8px 10px 10px', textDecoration: 'none', color: '#1A1A1A', display: 'block' },
  cardTitle: {
    fontSize: 13, fontWeight: 600, color: '#1A1A1A',
    marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  cardMeta: { fontSize: 11, color: '#888' },
  addCard: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: 100, border: '1.5px dashed #D0D0D0',
    borderRadius: 8, background: 'none', cursor: 'pointer',
  },
  empty: { color: '#AAA', fontSize: 14, textAlign: 'center', marginTop: 60 },
  sidebar: {
    width: 260, flexShrink: 0,
    borderLeft: '1px solid #E5E5E5', backgroundColor: '#FFFFFF',
    overflowY: 'auto', padding: 16,
  },
  sideSection: { marginBottom: 4 },
  sideTitleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sideTitle: { fontFamily: "'Inria Sans', serif", fontSize: 14, fontWeight: 700, color: '#1A1A1A', margin: 0 },
  sideAddBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888', padding: 0 },
  dateLabel: { fontSize: 10, fontWeight: 700, color: '#888', letterSpacing: '0.04em', marginBottom: 6, textTransform: 'uppercase' },
  timelineTask: { display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  taskCircle: {
    width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #BBBBBB',
    flexShrink: 0, marginTop: 2, cursor: 'pointer', padding: 0,
    transition: 'background-color 0.15s, border-color 0.15s',
  },
  taskName: { fontSize: 12, fontWeight: 500, lineHeight: 1.4 },
  taskMeta: { fontSize: 10, color: '#888', marginTop: 1 },
}