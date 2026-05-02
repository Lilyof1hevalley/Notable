import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Sample data ───────────────────────────────────────────────────────────────
const INITIAL_CHAPTERS = [
  { id: 1, title: 'Chapter 1: Introduction', preview: 'An overview of the core concepts covered in this notebook. Topics include foundational theory, key definitions, and the scope of the subject matter as outlined in the course syllabus.', createdOn: '25/03/2026' },
  { id: 2, title: 'Chapter 2: Core Concepts', preview: 'Deep dive into the primary subject matter with worked examples and case studies. This chapter builds on the introduction and presents the main theoretical framework used throughout the course.', createdOn: '25/03/2026' },
  { id: 3, title: 'Chapter 3: Applications', preview: 'Practical applications and problem-solving strategies derived from the core concepts. Students are expected to apply the theoretical knowledge from Chapter 2 to solve real-world scenarios.', createdOn: '25/03/2026' },
  { id: 4, title: 'Chapter 4: Advanced Topics', preview: 'Extension material for deeper understanding. Covers advanced derivations, edge cases, and contemporary research directions relevant to the subject area.', createdOn: '26/03/2026' },
  { id: 5, title: 'Chapter 5: Review & Summary', preview: 'Consolidated review of all topics covered throughout the notebook. Includes a structured summary, key takeaways, and a self-assessment checklist to prepare for examinations.', createdOn: '26/03/2026' },
]

const INITIAL_TIMELINE = [
  { id: 1, name: 'Review Chapter 3', time: '08:00', folder: 'Discrete Math', date: '25 Mar 2026' },
  { id: 2, name: 'Submit Lab Report', time: '10:00', folder: 'Physics', date: '25 Mar 2026' },
  { id: 3, name: 'Quiz Preparation', time: '09:00', folder: 'Calculus', date: '26 Mar 2026' },
  { id: 4, name: 'Group Meeting', time: '13:00', folder: 'Software Eng', date: '26 Mar 2026' },
]

const INITIAL_RESOURCES = [
  { chapter: 'Chapter 1', files: ['Textbook.pdf', 'Lecture_Slides.pdf'], images: ['Diagram_1.png'] },
  { chapter: 'Chapter 2', files: ['Textbook.pdf'], images: ['7404_Datasheet.png', '7420_Datasheet.png'] },
]

// ── Add Note Modal ────────────────────────────────────────────────────────────
function AddNoteModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title, content })
    onClose()
  }

  return (
    <div style={modal.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={modal.box}>
        <div style={modal.header}>
          <h2 style={modal.title}>New Note</h2>
          <button style={modal.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={modal.form}>
          <div style={modal.field}>
            <label style={modal.label}>CHAPTER TITLE</label>
            <input
              type="text"
              placeholder="e.g. Chapter 6: Probability Theory"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
              style={modal.input}
            />
          </div>

          <div style={modal.field}>
            <label style={modal.label}>CONTENT PREVIEW</label>
            <textarea
              placeholder="Write a brief summary or the first few lines of this chapter…"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={5}
              style={modal.textarea}
            />
          </div>

          <div style={modal.actions}>
            <button type="button" style={modal.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={modal.submitBtn}>ADD NOTE</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Notebook page ─────────────────────────────────────────────────────────────
export default function Notebook() {
  const navigate = useNavigate()
  const [chapters, setChapters] = useState(INITIAL_CHAPTERS)
  const [search, setSearch] = useState('')
  const [showAddNote, setShowAddNote] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  function handleAddNote({ title, content }) {
    const today = new Date()
    const d = today.getDate().toString().padStart(2, '0')
    const m = (today.getMonth() + 1).toString().padStart(2, '0')
    const y = today.getFullYear()
    setChapters(prev => [
      ...prev,
      {
        id: Date.now(),
        title: `Chapter ${prev.length + 1}: ${title}`,
        preview: content || 'No preview available.',
        createdOn: `${d}/${m}/${y}`,
      },
    ])
  }

  const filtered = chapters.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={styles.page}>
      {showAddNote && (
        <AddNoteModal onClose={() => setShowAddNote(false)} onAdd={handleAddNote} />
      )}

      {/* Topbar */}
      <nav style={styles.nav}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          <span style={styles.backArrow}>←</span>
          <span style={styles.notebookTitle}>Notebook Title</span>
        </button>
        <div style={styles.navRight}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>⌕</span>
            <input
              style={styles.searchInput}
              placeholder="Search chapters…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button style={styles.searchClear} onClick={() => setSearch('')}>✕</button>}
          </div>
          <button style={styles.addNoteBtn} onClick={() => setShowAddNote(true)}>+ Add Note</button>
        </div>
      </nav>

      {/* Body */}
      <div style={styles.body}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          {/* Timeline */}
          <div style={styles.sideSection}>
            <div style={styles.sideHead}>
              <span style={styles.sideTitle}>Timeline</span>
              <button style={styles.sideAddBtn}>+</button>
            </div>
            {Object.entries(
              INITIAL_TIMELINE.reduce((acc, t) => {
                if (!acc[t.date]) acc[t.date] = []
                acc[t.date].push(t)
                return acc
              }, {})
            ).map(([date, tasks]) => (
              <div key={date} style={styles.dateGroup}>
                <div style={styles.dateLabel}>{date}</div>
                {tasks.map(task => (
                  <div key={task.id} style={styles.taskItem}>
                    <div style={styles.taskCircle} />
                    <div>
                      <div style={styles.taskName}>{task.name}</div>
                      <div style={styles.taskMeta}>{task.time} · {task.folder}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Resources */}
          <div style={styles.sideSection}>
            <div style={styles.sideHead}>
              <span style={styles.sideTitle}>Resources</span>
              <button style={styles.sideAddBtn}>+</button>
            </div>
            {INITIAL_RESOURCES.map(group => (
              <div key={group.chapter} style={styles.resourceGroup}>
                <div style={styles.resourceChapter}>{group.chapter}</div>
                {group.files.map(f => (
                  <div key={f} style={styles.resourceFile}>📄 {f}</div>
                ))}
                {group.images.map(img => (
                  <div key={img} style={{ ...styles.resourceFile, color: '#aaa' }}>🖼 {img}</div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main style={styles.main}>
          {filtered.length === 0 ? (
            <div style={styles.empty}>
              {search ? `No chapters matching "${search}"` : 'No chapters yet — add your first note!'}
            </div>
          ) : (
            filtered.map(ch => (
              <div
                key={ch.id}
                style={{
                  ...styles.chapterCard,
                  boxShadow: hoveredCard === ch.id ? '0 4px 20px rgba(0,0,0,0.09)' : '0 1px 4px rgba(0,0,0,0.04)',
                  borderColor: hoveredCard === ch.id ? '#C8C4BE' : '#E8E6E2',
                }}
                onMouseEnter={() => setHoveredCard(ch.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.chapterTitle}>{ch.title}</div>
                <div style={styles.chapterPreview}>{ch.preview}</div>
                <div style={styles.chapterDate}>Created on {ch.createdOn}</div>
              </div>
            ))
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
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
  },
  backArrow: { fontSize: 18, color: '#888', lineHeight: 1 },
  notebookTitle: {
    fontFamily: "'Georgia', serif",
    fontStyle: 'italic',
    fontSize: 18,
    fontWeight: 400,
    color: '#1a1a1a',
    textDecoration: 'underline',
    textUnderlineOffset: 4,
    textDecorationColor: '#ccc',
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
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: 13,
    color: '#1a1a1a',
    fontFamily: "'Inter', sans-serif",
  },
  searchClear: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#bbb', padding: 0 },
  addNoteBtn: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '7px 16px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.05em',
    flexShrink: 0,
  },
  body: { display: 'flex', height: 'calc(100vh - 54px)', overflow: 'hidden' },
  sidebar: {
    width: 252,
    flexShrink: 0,
    borderRight: '1px solid #E8E6E2',
    backgroundColor: '#fff',
    overflowY: 'auto',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  sideSection: {},
  sideHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sideTitle: {
    fontFamily: "'Georgia', serif",
    fontStyle: 'italic',
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: 400,
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
  taskItem: { display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7, cursor: 'pointer' },
  taskCircle: {
    width: 12, height: 12, borderRadius: '50%',
    border: '1.5px solid #D0CCC6', flexShrink: 0, marginTop: 2,
  },
  taskName: { fontSize: 12, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.4 },
  taskMeta: { fontSize: 11, color: '#bbb' },
  resourceGroup: { marginBottom: 12 },
  resourceChapter: { fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 4 },
  resourceFile: {
    fontSize: 11, color: '#888', padding: '2px 0 2px 10px',
    borderLeft: '2px solid #EDEBE7', marginBottom: 2, cursor: 'pointer',
  },
  main: { flex: 1, overflowY: 'auto', padding: '28px 32px' },
  empty: {
    textAlign: 'center', color: '#bbb', fontSize: 14, padding: '60px 0',
    fontFamily: "'Georgia', serif", fontStyle: 'italic',
  },
  chapterCard: {
    backgroundColor: '#fff',
    border: '1px solid #E8E6E2',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 12,
    cursor: 'pointer',
    transition: 'box-shadow 0.15s, border-color 0.15s',
  },
  chapterTitle: {
    fontFamily: "'Georgia', serif",
    fontStyle: 'italic',
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: 400,
    textDecoration: 'underline',
    textUnderlineOffset: 4,
    textDecorationColor: '#ccc',
    marginBottom: 10,
  },
  chapterPreview: {
    fontSize: 13,
    color: '#777',
    lineHeight: 1.65,
    marginBottom: 12,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontFamily: "'Georgia', serif",
  },
  chapterDate: {
    fontSize: 11, color: '#bbb', textAlign: 'right', fontFamily: "'Inter', sans-serif",
  },
}

// ── Modal styles ──────────────────────────────────────────────────────────────
const modal = {
  overlay: {
    position: 'fixed', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200, padding: 24, backdropFilter: 'blur(3px)',
  },
  box: {
    backgroundColor: '#F7F6F3',
    borderRadius: 18,
    padding: '36px 40px 32px',
    width: '100%', maxWidth: 480,
    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  title: {
    fontFamily: "'Georgia', serif",
    fontStyle: 'italic',
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
    padding: '13px 16px',
    backgroundColor: '#EDEBE7',
    border: '1.5px solid transparent',
    borderRadius: 8, fontSize: 15,
    color: '#1a1a1a', outline: 'none',
    fontFamily: "'Inria', serif",
    width: '100%', boxSizing: 'border-box',
  },
  textarea: {
    padding: '13px 16px',
    backgroundColor: '#EDEBE7',
    border: '1.5px solid transparent',
    borderRadius: 8, fontSize: 14,
    color: '#1a1a1a', outline: 'none',
    fontFamily: "'Inria', serif",
    width: '100%', boxSizing: 'border-box',
    resize: 'vertical', lineHeight: 1.6,
  },
  actions: { display: 'flex', gap: 10, marginTop: 8 },
  cancelBtn: {
    flex: 1, background: 'none',
    border: '1.5px solid #E0DDD8', borderRadius: 8,
    padding: '13px 0', fontSize: 12, fontWeight: 600,
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