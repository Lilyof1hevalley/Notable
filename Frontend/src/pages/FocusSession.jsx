import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Constants ─────────────────────────────────────────────────────────────────
const MODES = [
  { key: 'focus', label: 'Focus', minutes: 25, color: '#1A1A1A' },
  { key: 'short', label: 'Short Break', minutes: 5, color: '#555' },
  { key: 'long', label: 'Long Break', minutes: 15, color: '#555' },
]

const TASKS = [
  { id: 1, name: 'Review Chapter 3', folder: 'Discrete Math' },
  { id: 2, name: 'Submit Lab Report', folder: 'Physics' },
  { id: 3, name: 'Quiz Preparation', folder: 'Calculus' },
  { id: 4, name: 'Group Meeting', folder: 'Software Eng' },
]

const SOUNDS = [
  { key: 'none', label: 'None', icon: '—' },
  { key: 'rain', label: 'Rain', icon: '🌧' },
  { key: 'cafe', label: 'Café', icon: '☕' },
  { key: 'forest', label: 'Forest', icon: '🌿' },
  { key: 'white', label: 'White Noise', icon: '〰' },
]

function pad(n) { return String(n).padStart(2, '0') }

// ── Circular progress ring ─────────────────────────────────────────────────────
function Ring({ progress, size = 260, stroke = 6, children }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - progress)
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0F0F0" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="#1A1A1A" strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {children}
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    minHeight: '100vh',
    backgroundColor: '#F9F9F9',
    color: '#1A1A1A',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '52px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E5E5',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#555',
    padding: '4px',
    lineHeight: 1,
  },
  navTitle: { fontSize: '18px', fontStyle: 'italic', fontWeight: '400', color: '#1A1A1A' },
  navRight: { display: 'flex', alignItems: 'center', gap: '8px' },
  sessionCount: {
    fontSize: '12px',
    color: '#888',
    padding: '4px 10px',
    border: '1px solid #E5E5E5',
    borderRadius: '20px',
  },

  body: {
    flex: 1,
    display: 'flex',
    gap: '0',
    overflow: 'hidden',
    height: 'calc(100vh - 52px)',
  },

  // Left panel — timer
  timerPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 48px',
    gap: '32px',
  },

  // Mode tabs
  modeTabs: {
    display: 'flex',
    gap: '4px',
    backgroundColor: '#F0F0F0',
    borderRadius: '8px',
    padding: '3px',
  },
  modeTab: {
    padding: '6px 16px',
    fontSize: '13px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
  },

  // Timer display
  timerTime: {
    fontSize: '64px',
    fontStyle: 'italic',
    fontWeight: '400',
    letterSpacing: '-2px',
    color: '#1A1A1A',
    lineHeight: 1,
  },
  timerLabel: {
    fontSize: '12px',
    color: '#AAA',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginTop: '4px',
    textAlign: 'center',
  },

  // Controls
  controls: { display: 'flex', alignItems: 'center', gap: '12px' },
  ctrlBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '1px solid #E5E5E5',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#555',
    transition: 'background 0.15s',
  },
  playBtn: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#1A1A1A',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    transition: 'opacity 0.15s',
  },

  // Right panel — sidebar
  sidePanel: {
    width: '280px',
    flexShrink: 0,
    borderLeft: '1px solid #E5E5E5',
    backgroundColor: '#FFFFFF',
    overflowY: 'auto',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sideSectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: '0.02em',
    marginBottom: '10px',
  },

  // Task list
  taskItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '8px 10px',
    borderRadius: '7px',
    cursor: 'pointer',
    transition: 'background 0.12s',
    marginBottom: '4px',
  },
  taskRadio: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '1.5px solid #BBBBBB',
    flexShrink: 0,
    marginTop: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'border-color 0.15s, background 0.15s',
  },
  taskName: { fontSize: '12px', fontWeight: '500', color: '#1A1A1A', lineHeight: 1.4 },
  taskFolder: { fontSize: '11px', color: '#888' },

  // Sound buttons
  soundGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' },
  soundBtn: {
    padding: '8px 6px',
    border: '1px solid #E5E5E5',
    borderRadius: '7px',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '11px',
    color: '#555',
    backgroundColor: '#FFFFFF',
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    transition: 'background 0.12s, border-color 0.12s',
  },
  soundIcon: { fontSize: '16px', display: 'block', marginBottom: '3px' },

  // Log
  logItem: {
    padding: '6px 0',
    borderBottom: '1px solid #F0F0F0',
    fontSize: '12px',
    color: '#555',
    lineHeight: 1.5,
  },
  logTime: { fontSize: '11px', color: '#AAA' },

  // Settings row
  settingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  settingLabel: { fontSize: '12px', color: '#555' },
  settingInput: {
    width: '60px',
    border: '1px solid #D0D0D0',
    borderRadius: '5px',
    padding: '4px 8px',
    fontSize: '13px',
    textAlign: 'center',
    outline: 'none',
    fontFamily: "'Inria Sans', 'Inter', sans-serif",
    color: '#1A1A1A',
  },

  // Toggle switch
  toggle: {
    position: 'relative',
    width: '34px',
    height: '18px',
    borderRadius: '9px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    flexShrink: 0,
  },
  toggleKnob: {
    position: 'absolute',
    top: '2px',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    transition: 'left 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <div style={{ ...s.toggle, backgroundColor: on ? '#1A1A1A' : '#DDDDDD' }} onClick={() => onChange(!on)}>
      <div style={{ ...s.toggleKnob, left: on ? '18px' : '2px' }} />
    </div>
  )
}

// ── FocusSession ──────────────────────────────────────────────────────────────
export default function FocusSession() {
  const navigate = useNavigate()
  const [modeIdx, setModeIdx] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(MODES[0].minutes * 60)
  const [running, setRunning] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [sound, setSound] = useState('none')
  const [sessions, setSessions] = useState(0)
  const [log, setLog] = useState([])
  const [autoBreak, setAutoBreak] = useState(false)
  const [customMins, setCustomMins] = useState({ focus: 25, short: 5, long: 15 })

  const totalSecs = customMins[MODES[modeIdx].key] * 60
  const progress = secondsLeft / totalSecs
  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60

  // Timer tick
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(id)
          setRunning(false)
          if (MODES[modeIdx].key === 'focus') {
            setSessions(n => n + 1)
            setLog(l => [{
              text: selectedTask ? `Completed: ${selectedTask.name}` : 'Focus session completed',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }, ...l])
          }
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, modeIdx, selectedTask])

  const switchMode = (idx) => {
    setModeIdx(idx)
    setRunning(false)
    setSecondsLeft(customMins[MODES[idx].key] * 60)
  }

  const toggleRun = () => setRunning(r => !r)

  const reset = () => {
    setRunning(false)
    setSecondsLeft(customMins[MODES[modeIdx].key] * 60)
  }

  const skip = () => {
    setRunning(false)
    const next = (modeIdx + 1) % MODES.length
    switchMode(next)
  }

  // Update total when custom mins change
  useEffect(() => {
    setSecondsLeft(customMins[MODES[modeIdx].key] * 60)
  }, [customMins, modeIdx])

  return (
    <div style={s.page}>

      {/* Navbar */}
      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <button style={s.backBtn} onClick={() => navigate('/dashboard')}>←</button>
          <span style={s.navTitle}>Focus Session</span>
        </div>
        <div style={s.navRight}>
          <span style={s.sessionCount}>
            {sessions} {sessions === 1 ? 'session' : 'sessions'} completed
          </span>
        </div>
      </nav>

      <div style={s.body}>

        {/* Timer Panel */}
        <div style={s.timerPanel}>

          {/* Mode tabs */}
          <div style={s.modeTabs}>
            {MODES.map((m, i) => (
              <button key={m.key} onClick={() => switchMode(i)} style={{
                ...s.modeTab,
                backgroundColor: modeIdx === i ? '#FFFFFF' : 'transparent',
                color: modeIdx === i ? '#1A1A1A' : '#888',
                boxShadow: modeIdx === i ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}>{m.label}</button>
            ))}
          </div>

          {/* Ring + time */}
          <Ring progress={progress} size={260} stroke={5}>
            <div style={{ textAlign: 'center' }}>
              <div style={s.timerTime}>{pad(mins)}:{pad(secs)}</div>
              {selectedTask
                ? <div style={s.timerLabel}>{selectedTask.name}</div>
                : <div style={s.timerLabel}>{MODES[modeIdx].label}</div>
              }
            </div>
          </Ring>

          {/* Pomodoro dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: i < (sessions % 4) ? '#1A1A1A' : '#E5E5E5',
              }} />
            ))}
          </div>

          {/* Controls */}
          <div style={s.controls}>
            <button style={s.ctrlBtn} onClick={reset} title="Reset">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
            <button style={s.playBtn} onClick={toggleRun}>
              {running
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
              }
            </button>
            <button style={s.ctrlBtn} onClick={skip} title="Skip to next">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>
              </svg>
            </button>
          </div>

          {selectedTask && (
            <div style={{
              fontSize: '12px', color: '#888', fontStyle: 'italic',
              padding: '8px 16px', backgroundColor: '#F5F5F5',
              borderRadius: '20px', maxWidth: '280px', textAlign: 'center',
            }}>
              Working on: <strong style={{ color: '#1A1A1A' }}>{selectedTask.name}</strong>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <aside style={s.sidePanel}>

          {/* Tasks */}
          <div>
            <div style={s.sideSectionTitle}>Tasks</div>
            {TASKS.map(task => (
              <div key={task.id}
                style={{
                  ...s.taskItem,
                  backgroundColor: selectedTask?.id === task.id ? '#F5F5F5' : 'transparent',
                }}
                onClick={() => setSelectedTask(t => t?.id === task.id ? null : task)}
              >
                <div style={{
                  ...s.taskRadio,
                  borderColor: selectedTask?.id === task.id ? '#1A1A1A' : '#BBBBBB',
                  backgroundColor: selectedTask?.id === task.id ? '#1A1A1A' : 'transparent',
                }}>
                  {selectedTask?.id === task.id && (
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#FFF' }} />
                  )}
                </div>
                <div>
                  <div style={s.taskName}>{task.name}</div>
                  <div style={s.taskFolder}>{task.folder}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Ambient Sound */}
          <div>
            <div style={s.sideSectionTitle}>Ambient Sound</div>
            <div style={s.soundGrid}>
              {SOUNDS.map(snd => (
                <button key={snd.key} style={{
                  ...s.soundBtn,
                  backgroundColor: sound === snd.key ? '#1A1A1A' : '#FFFFFF',
                  color: sound === snd.key ? '#FFFFFF' : '#555',
                  borderColor: sound === snd.key ? '#1A1A1A' : '#E5E5E5',
                }} onClick={() => setSound(s => s === snd.key ? 'none' : snd.key)}>
                  <span style={s.soundIcon}>{snd.icon}</span>
                  {snd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div>
            <div style={s.sideSectionTitle}>Settings</div>
            {[
              { key: 'focus', label: 'Focus (min)' },
              { key: 'short', label: 'Short break (min)' },
              { key: 'long', label: 'Long break (min)' },
            ].map(({ key, label }) => (
              <div key={key} style={s.settingRow}>
                <span style={s.settingLabel}>{label}</span>
                <input type="number" min="1" max="90" style={s.settingInput}
                  value={customMins[key]}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(90, Number(e.target.value)))
                    setCustomMins(p => ({ ...p, [key]: v }))
                  }}
                />
              </div>
            ))}
            <div style={s.settingRow}>
              <span style={s.settingLabel}>Auto-start break</span>
              <Toggle on={autoBreak} onChange={setAutoBreak} />
            </div>
          </div>

          {/* Session Log */}
          {log.length > 0 && (
            <div>
              <div style={s.sideSectionTitle}>Session Log</div>
              {log.map((entry, i) => (
                <div key={i} style={s.logItem}>
                  <div>{entry.text}</div>
                  <div style={s.logTime}>{entry.time}</div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}