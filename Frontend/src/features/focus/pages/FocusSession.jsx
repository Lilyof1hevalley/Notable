import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Sample data (replace with real API later) ─────────────────────────────────
const sampleBlock = {
  title: 'Data Mining focus block',
  description:
    'Prepare Data Mining quiz summary has the highest BHPS score, then related work is grouped to reduce context switching.',
  duration: 50,
  load: 'Light load',
  folder: 'Data Mining',
  steps: [
    { id: 1, title: 'Review context',          desc: 'Skim linked notes and resources before starting the main task.' },
    { id: 2, title: 'Do the highest-impact task', desc: 'Prepare Data Mining quiz summary' },
    { id: 3, title: 'Reflect briefly',         desc: 'Capture one short note about what changed, what remains, and the next action.' },
  ],
  tasks: [
    { id: 1, title: 'Prepare Data Mining quiz summary', time: '06:02 PM', load: 'Moderate focus block', priority: 81 },
  ],
  notes: 'QUICK NOTE 2',
  resources: 'DATASET_SAM...',
}

const allTasks = [
  { id: 1, title: 'Prepare Data Mining quiz summary',          time: '06:02 PM' },
  { id: 2, title: 'Archive completed coursework notes',        time: '05:02 AM' },
  { id: 3, title: 'Create mobile app wireframe notes',         time: '08:02 PM' },
  { id: 4, title: 'Practice machine learning evaluation metrics', time: '01:02 AM' },
]

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100vh',
    background: '#F5F4F1',
    fontFamily: "'Inria Serif', Georgia, serif",
    color: '#1A1A1A',
    display: 'flex',
    flexDirection: 'column',
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    height: '56px',
    background: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5',
    flexShrink: 0,
  },
  topbarTitle: {
    margin: 0,
    fontSize: '20px',
    fontStyle: 'italic',
    fontWeight: 400,
    color: '#1A1A1A',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#555',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: "'Inria Serif', Georgia, serif",
  },

  // Idle view
  idlePage: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px 24px',
  },
  idleCard: {
    background: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '440px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  blockTitle: {
    fontSize: '22px',
    fontStyle: 'italic',
    fontWeight: 400,
    margin: 0,
    lineHeight: 1.2,
  },
  blockDesc: {
    fontSize: '11px',
    fontFamily: "'Inter', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: '#68768D',
    margin: 0,
    lineHeight: 1.5,
  },
  tags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  tag: {
    border: '1px solid #D0D0CE',
    borderRadius: '999px',
    padding: '4px 12px',
    fontSize: '13px',
    color: '#3F3F3D',
    background: '#FFFFFF',
  },
  stepList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  stepCard: {
    display: 'grid',
    gridTemplateColumns: '28px minmax(0,1fr)',
    gap: '12px',
    alignItems: 'start',
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    padding: '12px',
    background: '#FAFAFA',
  },
  stepNum: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#1A1A1A',
    color: '#FFF',
    fontSize: '11px',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
    flexShrink: 0,
  },
  stepTitle: {
    fontSize: '14px',
    fontStyle: 'italic',
    fontWeight: 400,
    margin: 0,
    lineHeight: 1.3,
  },
  stepDesc: {
    fontSize: '13px',
    color: '#68768D',
    margin: '4px 0 0',
    fontFamily: "'Inter', sans-serif",
  },
  taskCard: {
    display: 'grid',
    gridTemplateColumns: '28px minmax(0,1fr)',
    gap: '12px',
    alignItems: 'start',
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    padding: '12px',
    background: '#FAFAFA',
  },
  taskTitle: {
    fontSize: '14px',
    fontStyle: 'italic',
    margin: 0,
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  taskMeta: {
    fontSize: '12px',
    color: '#68768D',
    margin: '3px 0 0',
    fontFamily: "'Inter', sans-serif",
  },
  taskBadges: {
    display: 'flex',
    gap: '6px',
    marginTop: '6px',
  },
  badgeHigh: {
    padding: '3px 8px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 800,
    background: '#1A1A1A',
    color: '#FFF',
    fontFamily: "'Inter', sans-serif",
  },
  badgeNeutral: {
    padding: '3px 8px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 800,
    border: '1px solid #D0D0CE',
    color: '#5E5E5B',
    fontFamily: "'Inter', sans-serif",
  },
  supportGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  supportBox: {
    border: '1px dashed #D0D0CE',
    borderRadius: '8px',
    padding: '12px',
    background: '#FFFFFF',
  },
  supportLabel: {
    fontSize: '12px',
    color: '#68768D',
    margin: '0 0 6px',
    fontFamily: "'Inter', sans-serif",
  },
  supportValue: {
    fontSize: '11px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: '#1A1A1A',
    fontFamily: "'Inter', sans-serif",
  },
  prepareBtn: {
    width: '100%',
    padding: '14px',
    background: '#1A1A1A',
    color: '#FFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 800,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },

  // Prepare modal overlay
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '24px',
  },
  modal: {
    background: '#FFFFFF',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #E5E5E5',
  },
  modalTitle: {
    fontSize: '18px',
    fontStyle: 'italic',
    fontWeight: 400,
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#555',
    lineHeight: 1,
  },
  modalBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  modalNote: {
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    padding: '16px',
    background: '#FAFAFA',
  },
  modalNoteTitle: {
    fontSize: '14px',
    fontStyle: 'italic',
    margin: '0 0 6px',
  },
  modalNoteDesc: {
    fontSize: '11px',
    fontFamily: "'Inter', sans-serif",
    textTransform: 'uppercase',
    color: '#68768D',
    margin: 0,
    letterSpacing: '0.04em',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 120px',
    gap: '12px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formLabel: {
    fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
    color: '#1A1A1A',
    fontWeight: 600,
  },
  formInput: {
    border: '1px solid #E5E5E5',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '14px',
    fontFamily: "'Inria Serif', Georgia, serif",
    color: '#1A1A1A',
    background: '#FFFFFF',
    outline: 'none',
    width: '100%',
  },
  formTextarea: {
    border: '1px solid #E5E5E5',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
    color: '#1A1A1A',
    background: '#FFFFFF',
    outline: 'none',
    width: '100%',
    resize: 'vertical',
    minHeight: '80px',
  },
  tasksHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tasksLabel: {
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
  },
  tasksCount: {
    fontSize: '13px',
    color: '#68768D',
    fontFamily: "'Inter', sans-serif",
  },
  tasksList: {
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    overflow: 'hidden',
    maxHeight: '240px',
    overflowY: 'auto',
  },
  taskOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderBottom: '1px solid #E5E5E5',
    cursor: 'pointer',
  },
  taskOptionTitle: {
    fontSize: '14px',
    fontStyle: 'italic',
    margin: 0,
    lineHeight: 1.3,
  },
  taskOptionTime: {
    fontSize: '12px',
    color: '#68768D',
    fontFamily: "'Inter', sans-serif",
    margin: '2px 0 0',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '16px 24px',
    borderTop: '1px solid #E5E5E5',
  },
  cancelBtn: {
    padding: '10px 20px',
    border: '1px solid #E5E5E5',
    borderRadius: '6px',
    background: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  startBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    background: '#1A1A1A',
    color: '#FFF',
    fontSize: '13px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },

  // Active session view
  activePage: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px 24px',
  },
  activeModal: {
    background: '#FFFFFF',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '600px',
    overflow: 'hidden',
  },
  activeHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #E5E5E5',
  },
  activeTitle: {
    fontSize: '18px',
    fontStyle: 'italic',
    fontWeight: 400,
    margin: 0,
  },
  timerBox: {
    padding: '20px 24px',
    borderBottom: '1px solid #E5E5E5',
    background: '#FAFAFA',
  },
  timerLabel: {
    fontSize: '11px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#68768D',
    fontFamily: "'Inter', sans-serif",
    margin: '0 0 8px',
  },
  timerValue: {
    fontSize: '48px',
    fontWeight: 400,
    fontStyle: 'italic',
    margin: '0 0 8px',
    lineHeight: 1,
  },
  timerBar: {
    height: '6px',
    borderRadius: '999px',
    background: '#E5E5E5',
    overflow: 'hidden',
    margin: '8px 0',
  },
  timerBarFill: {
    height: '100%',
    borderRadius: 'inherit',
    background: '#1A1A1A',
    transition: 'width 1s linear',
  },
  timerMeta: {
    fontSize: '13px',
    color: '#68768D',
    fontFamily: "'Inter', sans-serif",
    margin: 0,
  },
  timerActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
  },
  activeBody: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    padding: '20px 24px',
  },
  activeBox: {
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    padding: '14px',
    background: '#FAFAFA',
  },
  activeBoxLabel: {
    fontSize: '12px',
    color: '#68768D',
    fontFamily: "'Inter', sans-serif",
    margin: '0 0 8px',
  },
  activeBoxValue: {
    fontSize: '13px',
    color: '#1A1A1A',
    margin: 0,
    lineHeight: 1.5,
  },
  activeTaskCard: {
    display: 'grid',
    gridTemplateColumns: '32px minmax(0,1fr)',
    gap: '12px',
    alignItems: 'center',
    border: '1px solid #E5E5E5',
    borderRadius: '8px',
    padding: '12px',
    background: '#FAFAFA',
    gridColumn: '1 / -1',
  },
  activeTaskNum: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#1A1A1A',
    color: '#FFF',
    fontSize: '12px',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
    flexShrink: 0,
  },
  minimizeBtn: {
    padding: '8px 16px',
    border: '1px solid #E5E5E5',
    borderRadius: '6px',
    background: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  endBtn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    background: '#1A1A1A',
    color: '#FFF',
    fontSize: '12px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
}

// ── Prepare Modal ─────────────────────────────────────────────────────────────
function PrepareModal({ onClose, onStart }) {
  const [title, setTitle] = useState(sampleBlock.title)
  const [duration, setDuration] = useState(sampleBlock.duration)
  const [notes, setNotes] = useState(sampleBlock.description)
  const [selected, setSelected] = useState([1])

  const toggle = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  return (
    <div style={S.overlay}>
      <div style={S.modal}>
        <div style={S.modalHeader}>
          <h2 style={S.modalTitle}>Prepare Focus Session</h2>
          <button style={S.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={S.modalBody}>
          <div style={S.modalNote}>
            <p style={S.modalNoteTitle}>Review this block before starting.</p>
            <p style={S.modalNoteDesc}>Tune the duration, notes, and task list now. Once the timer starts, the session stays simple.</p>
          </div>
          <div style={S.formRow}>
            <div style={S.formGroup}>
              <label style={S.formLabel}>Session title</label>
              <input style={S.formInput} value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div style={S.formGroup}>
              <label style={S.formLabel}>Duration</label>
              <input style={S.formInput} type="number" value={duration} onChange={e => setDuration(e.target.value)} />
            </div>
          </div>
          <div style={S.formGroup}>
            <label style={S.formLabel}>Session notes</label>
            <textarea style={S.formTextarea} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div>
            <div style={S.tasksHeader}>
              <span style={S.tasksLabel}>Tasks in this block</span>
              <span style={S.tasksCount}>{selected.length} selected</span>
            </div>
            <div style={{ ...S.tasksList, marginTop: '8px' }}>
              {allTasks.map((t, i) => (
                <div
                  key={t.id}
                  style={{
                    ...S.taskOption,
                    borderBottom: i < allTasks.length - 1 ? '1px solid #E5E5E5' : 'none',
                    background: selected.includes(t.id) ? '#FAFAFA' : '#FFFFFF',
                  }}
                  onClick={() => toggle(t.id)}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(t.id)}
                    onChange={() => toggle(t.id)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <div>
                    <p style={S.taskOptionTitle}>{t.title}</p>
                    <p style={S.taskOptionTime}>{t.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={S.modalFooter}>
          <button style={S.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={S.startBtn} onClick={() => onStart({ title, duration, notes, selected })}>Start Focus</button>
        </div>
      </div>
    </div>
  )
}

// ── Active Session ────────────────────────────────────────────────────────────
function ActiveSession({ config, onEnd }) {
  const TOTAL = config.duration * 60
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setElapsed(e => Math.min(e + 1, TOTAL)), 1000)
    return () => clearInterval(id)
  }, [TOTAL])

  const remaining = TOTAL - elapsed
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const pct = (elapsed / TOTAL) * 100
  const selectedTasks = allTasks.filter(t => config.selected.includes(t.id))

  return (
    <div style={S.activePage}>
      <div style={S.activeModal}>
        <div style={S.activeHeader}>
          <h2 style={S.activeTitle}>Focus Session</h2>
          <button style={S.closeBtn} onClick={onEnd}>✕</button>
        </div>
        <div style={S.timerBox}>
          <p style={S.timerLabel}>Now Focusing</p>
          <p style={S.timerValue}>{mm}:{ss}</p>
          <div style={S.timerBar}>
            <div style={{ ...S.timerBarFill, width: `${pct}%` }} />
          </div>
          <p style={S.timerMeta}>{config.title} / 0 of {config.selected.length} tasks complete</p>
          <div style={S.timerActions}>
            <button style={S.minimizeBtn}>Minimize</button>
            <button style={S.endBtn} onClick={onEnd}>End Session</button>
          </div>
        </div>
        <div style={S.activeBody}>
          <div style={S.activeBox}>
            <p style={S.activeBoxLabel}>Session note</p>
            <p style={S.activeBoxValue}>{config.notes}</p>
          </div>
          <div style={S.activeBox}>
            <p style={S.activeBoxLabel}>Notes</p>
            <p style={{ ...S.activeBoxValue, fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Inter', sans-serif" }}>
              {sampleBlock.notes}
            </p>
          </div>
          {selectedTasks.map((t, i) => (
            <div key={t.id} style={S.activeTaskCard}>
              <div style={S.activeTaskNum}>{i + 1}</div>
              <div>
                <p style={{ ...S.taskOptionTitle, margin: 0 }}>{t.title}</p>
                <p style={S.taskOptionTime}>{t.time} / Moderate focus block</p>
              </div>
            </div>
          ))}
          <div style={S.activeBox}>
            <p style={S.activeBoxLabel}>Resources</p>
            <p style={{ ...S.activeBoxValue, fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: "'Inter', sans-serif" }}>
              {sampleBlock.resources}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FocusSession() {
  const navigate = useNavigate()
  const [showPrepare, setShowPrepare] = useState(false)
  const [activeConfig, setActiveConfig] = useState(null)

  const handleStart = (config) => {
    setShowPrepare(false)
    setActiveConfig(config)
  }

  if (activeConfig) {
    return (
      <div style={S.page}>
        <header style={S.topbar}>
          <h1 style={S.topbarTitle}>Focus Session</h1>
          <button style={S.backBtn} onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
        </header>
        <ActiveSession config={activeConfig} onEnd={() => setActiveConfig(null)} />
      </div>
    )
  }

  return (
    <div style={S.page}>
      <header style={S.topbar}>
        <h1 style={S.topbarTitle}>Focus Session</h1>
        <button style={S.backBtn} onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      </header>

      <div style={S.idlePage}>
        <div style={S.idleCard}>
          {/* Block title */}
          <div>
            <h2 style={S.blockTitle}>{sampleBlock.title}</h2>
            <p style={S.blockDesc}>
              Review this block before starting. {sampleBlock.description}
            </p>
          </div>

          {/* Tags */}
          <div style={S.tags}>
            <span style={S.tag}>{sampleBlock.duration} min</span>
            <span style={S.tag}>{sampleBlock.load}</span>
            <span style={S.tag}>{sampleBlock.folder}</span>
          </div>

          {/* Steps */}
          <div style={S.stepList}>
            {sampleBlock.steps.map(step => (
              <div key={step.id} style={S.stepCard}>
                <div style={S.stepNum}>{step.id}</div>
                <div>
                  <p style={S.stepTitle}>{step.title}</p>
                  <p style={S.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tasks */}
          {sampleBlock.tasks.map((task, i) => (
            <div key={task.id} style={S.taskCard}>
              <div style={{ ...S.stepNum, background: '#1A1A1A' }}>{i + 1}</div>
              <div>
                <p style={S.taskTitle}>{task.title}</p>
                <p style={S.taskMeta}>{task.time} / {task.load}</p>
                <div style={S.taskBadges}>
                  <span style={S.badgeHigh}>HIGH {task.priority}</span>
                  <span style={S.badgeNeutral}>MODERATE</span>
                </div>
              </div>
            </div>
          ))}

          {/* Notes & Resources */}
          <div style={S.supportGrid}>
            <div style={S.supportBox}>
              <p style={S.supportLabel}>Notes</p>
              <p style={S.supportValue}>{sampleBlock.notes}</p>
            </div>
            <div style={S.supportBox}>
              <p style={S.supportLabel}>Resources</p>
              <p style={S.supportValue}>{sampleBlock.resources}</p>
            </div>
          </div>

          <button style={S.prepareBtn} onClick={() => setShowPrepare(true)}>
            Prepare Focus
          </button>
        </div>
      </div>

      {showPrepare && (
        <PrepareModal
          onClose={() => setShowPrepare(false)}
          onStart={handleStart}
        />
      )}
    </div>
  )
}