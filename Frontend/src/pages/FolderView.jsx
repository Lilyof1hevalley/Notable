import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const notebookData = {
  'discrete-math': {
    title: 'Discrete Math',
    chapters: [
      { id: 1, title: 'Chapter 1: Sets & Logic', preview: 'Foundations of discrete mathematics including set theory, propositional logic, and truth tables. Covers De Morgan\'s laws and logical equivalences extensively.', createdOn: '25/03/2026' },
      { id: 2, title: 'Chapter 2: Graph Theory', preview: 'Introduction to graphs, directed and undirected. Euler paths, Hamiltonian circuits, and tree structures are explored with worked examples.', createdOn: '26/03/2026' },
      { id: 3, title: 'Chapter 3: Combinatorics', preview: 'Counting principles, permutations, combinations, and the pigeonhole principle. Binomial theorem and generating functions.', createdOn: '27/03/2026' },
    ],
    timeline: [
      { id: 1, name: 'Review Chapter 3', time: '08:00', date: '25 Mar 2026' },
      { id: 2, name: 'Problem Set 2 Due', time: '23:59', date: '26 Mar 2026' },
    ],
    resources: [
      { chapter: 'Chapter 1', files: ['Textbook_Ch1.pdf', 'Lecture_Slides_01.pdf'], images: [] },
      { chapter: 'Chapter 2', files: ['Textbook_Ch2.pdf'], images: ['Graph_Examples.png'] },
    ],
  },
}

const fallbackData = (title) => ({
  title,
  chapters: [
    { id: 1, title: 'Chapter 1: Introduction', preview: 'An overview of the core concepts covered in this notebook. Topics include foundational theory, key definitions, and the scope of the subject matter.', createdOn: '25/03/2026' },
    { id: 2, title: 'Chapter 2: Core Concepts', preview: 'Deep dive into the primary subject matter with worked examples and case studies. Builds on the introduction and presents the main theoretical framework.', createdOn: '26/03/2026' },
  ],
  timeline: [
    { id: 1, name: 'Review Notes', time: '09:00', date: '25 Mar 2026' },
  ],
  resources: [
    { chapter: 'Chapter 1', files: ['Textbook.pdf'], images: [] },
  ],
})

const styles = {
  page: {
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    minHeight: '100vh',
    backgroundColor: '#F9F9F9',
    color: '#1A1A1A',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '52px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#1A1A1A',
  },
  backArrow: {
    fontSize: '16px',
    color: '#555',
  },
  notebookTitle: {
    fontFamily: "'Inria Sans', serif",
    fontSize: '18px',
    fontStyle: 'italic',
    fontWeight: '700',
    textDecoration: 'underline',
    textDecorationStyle: 'solid',
    color: '#1A1A1A',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    border: '1px solid #D0D0D0',
    borderRadius: '6px',
    padding: '5px 10px',
    fontSize: '13px',
    backgroundColor: '#FFFFFF',
    width: '200px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '13px',
    width: '100%',
    backgroundColor: 'transparent',
    color: '#1A1A1A',
    fontFamily: "'Inria Sans', sans-serif",
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#555',
    padding: '4px',
  },
  body: {
    display: 'flex',
    height: 'calc(100vh - 52px)',
    overflow: 'hidden',
  },
  sidebar: {
    width: '260px',
    flexShrink: 0,
    borderRight: '1px solid #E5E5E5',
    backgroundColor: '#FFFFFF',
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  sidebarTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: '0.02em',
    fontFamily: "'Inria Sans', sans-serif",
    textTransform: 'uppercase',
  },
  addBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#555',
    lineHeight: 1,
    padding: '0 2px',
  },
  dateLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#888',
    marginBottom: '6px',
    letterSpacing: '0.04em',
    fontFamily: "'Inria Sans', sans-serif",
  },
  taskItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '6px',
    padding: '6px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  taskCheckbox: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '1.5px solid #BBBBBB',
    flexShrink: 0,
    marginTop: '2px',
  },
  taskName: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#1A1A1A',
    lineHeight: 1.4,
    fontFamily: "'Inria Sans', sans-serif",
  },
  taskMeta: {
    fontSize: '11px',
    color: '#888',
    fontFamily: "'Inria Sans', sans-serif",
  },
  resourceChapter: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: '4px',
    fontFamily: "'Inria Sans', sans-serif",
  },
  resourceFile: {
    fontSize: '11px',
    color: '#555',
    padding: '2px 0 2px 8px',
    borderLeft: '2px solid #E5E5E5',
    marginBottom: '2px',
    cursor: 'pointer',
    fontFamily: "'Inria Sans', sans-serif",
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 32px',
  },
  newChapterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1.5px dashed #CCCCCC',
    borderRadius: '8px',
    padding: '14px 20px',
    marginBottom: '12px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition: 'border-color 0.15s, background 0.15s',
    width: '100%',
    textAlign: 'left',
    fontSize: '13px',
    color: '#AAAAAA',
    fontFamily: "'Inria Sans', sans-serif",
  },
  chapterCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    padding: '16px 20px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'box-shadow 0.15s, border-color 0.15s',
  },
  chapterTitle: {
    fontFamily: "'Inria Sans', serif",
    fontSize: '15px',
    fontWeight: '700',
    fontStyle: 'italic',
    textDecoration: 'underline',
    color: '#1A1A1A',
    marginBottom: '8px',
  },
  chapterPreview: {
    fontSize: '13px',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '10px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontFamily: "'Inria Sans', sans-serif",
  },
  chapterDate: {
    fontSize: '11px',
    color: '#AAA',
    textAlign: 'right',
    fontFamily: "'Inria Sans', sans-serif",
  },
}

export default function FolderView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredTask, setHoveredTask] = useState(null)
  const [hoveredNewChapter, setHoveredNewChapter] = useState(false)

  const notebookTitle = id
    ? id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    : 'Notebook'

  const data = notebookData[id] || fallbackData(notebookTitle)

  const filteredChapters = data.chapters.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={styles.page}>

      {/* ── Navbar ── */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft} onClick={() => navigate('/dashboard')}>
          <span style={styles.backArrow}>←</span>
          <span style={styles.notebookTitle}>{data.title}</span>
        </div>
        <div style={styles.navRight}>
          <div style={styles.searchBar}>
            <span style={{ color: '#AAA', fontSize: '13px' }}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search chapters"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <span style={{ cursor: 'pointer', color: '#AAA', fontSize: '12px' }} onClick={() => setSearch('')}>✕</span>
            )}
          </div>
          <button style={styles.iconBtn} title="Filter">▽</button>
          <button style={styles.iconBtn} title="Sort">↕</button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div style={styles.body}>

        {/* ── Left Sidebar ── */}
        <aside style={styles.sidebar}>

          {/* Timeline */}
          <div>
            <div style={styles.sidebarHeader}>
              <span style={styles.sidebarTitle}>Timeline</span>
              <button style={styles.addBtn} title="Add task">+</button>
            </div>
            {data.timeline.map(task => (
              <div key={task.id}>
                <div style={styles.dateLabel}>{task.date}</div>
                <div
                  style={{
                    ...styles.taskItem,
                    background: hoveredTask === task.id ? '#F5F5F5' : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredTask(task.id)}
                  onMouseLeave={() => setHoveredTask(null)}
                >
                  <div style={styles.taskCheckbox} />
                  <div>
                    <div style={styles.taskName}>{task.name}</div>
                    <div style={styles.taskMeta}>{task.time} · {data.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div>
            <div style={styles.sidebarHeader}>
              <span style={styles.sidebarTitle}>Resources</span>
              <button style={styles.addBtn} title="Add resource">+</button>
            </div>
            {data.resources.map(group => (
              <div key={group.chapter} style={{ marginBottom: '10px' }}>
                <div style={styles.resourceChapter}>{group.chapter}</div>
                {group.files.map(file => (
                  <div key={file} style={styles.resourceFile}>{file}</div>
                ))}
                {group.images.map(img => (
                  <div key={img} style={{ ...styles.resourceFile, color: '#888' }}>{img}</div>
                ))}
              </div>
            ))}
          </div>

        </aside>

        {/* ── Main Area ── */}
        <main style={styles.main}>

          {/* New Chapter button */}
          <button
            style={{
              ...styles.newChapterBtn,
              borderColor: hoveredNewChapter ? '#999' : '#CCCCCC',
              backgroundColor: hoveredNewChapter ? '#FAFAFA' : 'transparent',
            }}
            onMouseEnter={() => setHoveredNewChapter(true)}
            onMouseLeave={() => setHoveredNewChapter(false)}
          >
            <span style={{ fontSize: '16px' }}>+</span>
            New chapter
          </button>

          {filteredChapters.length === 0 ? (
            <div style={{ color: '#AAA', fontSize: '14px', textAlign: 'center', marginTop: '60px', fontFamily: "'Inria Sans', sans-serif" }}>
              No chapters found.
            </div>
          ) : (
            filteredChapters.map(chapter => (
              <div
                key={chapter.id}
                style={{
                  ...styles.chapterCard,
                  boxShadow: hoveredCard === chapter.id ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
                  borderColor: hoveredCard === chapter.id ? '#CCCCCC' : '#E5E5E5',
                }}
                onMouseEnter={() => setHoveredCard(chapter.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.chapterTitle}>{chapter.title}</div>
                <div style={styles.chapterPreview}>{chapter.preview}</div>
                <div style={styles.chapterDate}>Created On {chapter.createdOn}</div>
              </div>
            ))
          )}
        </main>

      </div>
    </div>
  )
}