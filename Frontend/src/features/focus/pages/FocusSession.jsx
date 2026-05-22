import { useEffect, useMemo, useState } from 'react'
import ProtectedTopbar from '../../../shared/components/ui/ProtectedTopbar'

const sampleBlock = {
  title: 'Data Mining focus block',
  description:
    'Prepare Data Mining quiz summary has the highest BHPS score, then related work is grouped to reduce context switching.',
  duration: 50,
  load: 'Light load',
  folder: 'Data Mining',
  steps: [
    { id: 1, title: 'Review context', desc: 'Skim linked notes and resources before starting the main task.' },
    { id: 2, title: 'Do the highest-impact task', desc: 'Prepare Data Mining quiz summary' },
    { id: 3, title: 'Reflect briefly', desc: 'Capture one short note about what changed, what remains, and the next action.' },
  ],
  tasks: [
    { id: 1, title: 'Prepare Data Mining quiz summary', time: '06:02 PM', load: 'Moderate focus block', priority: 81 },
  ],
  notes: ['Quick Note 2'],
  resources: ['Dataset_sam...'],
}

const allTasks = [
  { id: 1, title: 'Prepare Data Mining quiz summary', time: '06:02 PM' },
  { id: 2, title: 'Archive completed coursework notes', time: '05:02 AM' },
  { id: 3, title: 'Create mobile app wireframe notes', time: '08:02 PM' },
  { id: 4, title: 'Practice machine learning evaluation metrics', time: '01:02 AM' },
]

function Tags() {
  return (
    <div className="focus-page-tags">
      <span>{sampleBlock.duration} min</span>
      <span>{sampleBlock.load}</span>
      <span>{sampleBlock.folder}</span>
    </div>
  )
}

function FocusSteps() {
  return (
    <div className="focus-page-step-list">
      {sampleBlock.steps.map((step) => (
        <article className="focus-page-step" key={step.id}>
          <span>{step.id}</span>
          <div>
            <strong>{step.title}</strong>
            <p>{step.desc}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

function FocusTasks({ selectedTaskIds = [1] }) {
  const selected = allTasks.filter((task) => selectedTaskIds.includes(task.id))

  return (
    <div className="focus-page-task-list">
      {selected.map((task, index) => (
        <article className="focus-page-task" key={task.id}>
          <span>{index + 1}</span>
          <div>
            <strong>{task.title}</strong>
            <p>{task.time} / Moderate focus block</p>
            <div className="focus-page-badges">
              <span className="priority-badge priority-badge--high">High 81</span>
              <span className="load-badge load-badge--moderate">Moderate</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function SupportGrid() {
  return (
    <div className="focus-page-support-grid">
      <section>
        <span>Notes</span>
        {sampleBlock.notes.map((note) => <strong key={note}>{note}</strong>)}
      </section>
      <section>
        <span>Resources</span>
        {sampleBlock.resources.map((resource) => <strong key={resource}>{resource}</strong>)}
      </section>
    </div>
  )
}

function PrepareModal({ onClose, onStart }) {
  const [title, setTitle] = useState(sampleBlock.title)
  const [duration, setDuration] = useState(sampleBlock.duration)
  const [notes, setNotes] = useState(sampleBlock.description)
  const [selected, setSelected] = useState([1])

  function toggleTask(taskId) {
    setSelected((current) => (
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId]
    ))
  }

  return (
    <div className="focus-page-modal-backdrop">
      <div className="focus-page-modal" role="dialog" aria-modal="true" aria-labelledby="prepare-focus-title">
        <header>
          <h2 id="prepare-focus-title">Prepare Focus Session</h2>
          <button aria-label="Close prepare focus" onClick={onClose} type="button">x</button>
        </header>
        <div className="focus-page-modal-body">
          <div className="focus-page-modal-intro">
            <strong>Review this block before starting.</strong>
            <p>Tune the duration, notes, and task list now. Once the timer starts, the session stays simple.</p>
          </div>
          <div className="focus-page-form-grid">
            <label className="auth-form-label">
              Session title
              <input className="auth-form-input" onChange={(event) => setTitle(event.target.value)} value={title} />
            </label>
            <label className="auth-form-label">
              Duration
              <input
                className="auth-form-input"
                min="5"
                onChange={(event) => setDuration(event.target.value)}
                type="number"
                value={duration}
              />
            </label>
          </div>
          <label className="auth-form-label">
            Session notes
            <textarea
              className="auth-form-input focus-page-textarea"
              onChange={(event) => setNotes(event.target.value)}
              value={notes}
            />
          </label>
          <div className="focus-page-picker">
            <div>
              <strong>Tasks in this block</strong>
              <span>{selected.length} selected</span>
            </div>
            {allTasks.map((task) => (
              <label className="focus-page-task-option" key={task.id}>
                <input
                  checked={selected.includes(task.id)}
                  onChange={() => toggleTask(task.id)}
                  type="checkbox"
                />
                <span>
                  <strong>{task.title}</strong>
                  <small>{task.time}</small>
                </span>
              </label>
            ))}
          </div>
        </div>
        <footer>
          <button className="ghost-button" onClick={onClose} type="button">Cancel</button>
          <button
            disabled={selected.length === 0}
            onClick={() => onStart({ duration: Number(duration) || sampleBlock.duration, notes, selected, title })}
            type="button"
          >
            Start Focus
          </button>
        </footer>
      </div>
    </div>
  )
}

function ActiveSession({ config, onEnd }) {
  const totalSeconds = Math.max(60, Number(config.duration) * 60)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => Math.min(current + 1, totalSeconds))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [totalSeconds])

  const remainingSeconds = totalSeconds - elapsedSeconds
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0')
  const seconds = String(remainingSeconds % 60).padStart(2, '0')
  const progress = Math.min(100, (elapsedSeconds / totalSeconds) * 100)

  return (
    <div className="focus-page-layout focus-page-layout--active">
      <section className="focus-page-timer-card">
        <span>Now focusing</span>
        <h2>{minutes}:{seconds}</h2>
        <div className="focus-page-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p>{config.title} / 0 of {config.selected.length} tasks complete</p>
        <div className="focus-page-actions">
          <button className="ghost-button" type="button">Minimize</button>
          <button onClick={onEnd} type="button">End Session</button>
        </div>
      </section>
      <section className="focus-page-card focus-page-card--span">
        <div className="focus-page-section-header">
          <h2>Session Context</h2>
          <Tags />
        </div>
        <p>{config.notes}</p>
      </section>
      <section className="focus-page-card">
        <div className="focus-page-section-header">
          <h2>Tasks</h2>
        </div>
        <FocusTasks selectedTaskIds={config.selected} />
      </section>
      <section className="focus-page-card">
        <div className="focus-page-section-header">
          <h2>Support</h2>
        </div>
        <SupportGrid />
      </section>
    </div>
  )
}

function IdleSession({ onPrepare }) {
  return (
    <div className="focus-page-layout">
      <section className="focus-page-hero">
        <div>
          <span>Recommended focus block</span>
          <h2>{sampleBlock.title}</h2>
          <p>Review this block before starting. {sampleBlock.description}</p>
          <Tags />
        </div>
        <button onClick={onPrepare} type="button">Prepare Focus</button>
      </section>
      <section className="focus-page-card">
        <div className="focus-page-section-header">
          <h2>Study Sequence</h2>
        </div>
        <FocusSteps />
      </section>
      <section className="focus-page-card">
        <div className="focus-page-section-header">
          <h2>Priority Task</h2>
        </div>
        <FocusTasks />
      </section>
      <section className="focus-page-card focus-page-card--span">
        <div className="focus-page-section-header">
          <h2>Support Materials</h2>
        </div>
        <SupportGrid />
      </section>
    </div>
  )
}

export default function FocusSession() {
  const [isPrepareOpen, setIsPrepareOpen] = useState(false)
  const [activeConfig, setActiveConfig] = useState(null)

  const title = useMemo(() => (
    activeConfig ? 'Active Focus' : 'Focus Session'
  ), [activeConfig])

  function startFocus(config) {
    setActiveConfig(config)
    setIsPrepareOpen(false)
  }

  return (
    <main className="app-shell focus-page">
      <ProtectedTopbar
        backLabel="Back to Dashboard"
        backTo="/dashboard"
        className="focus-page-topbar"
        showSettings={false}
        title={title}
      />
      {activeConfig ? (
        <ActiveSession config={activeConfig} onEnd={() => setActiveConfig(null)} />
      ) : (
        <IdleSession onPrepare={() => setIsPrepareOpen(true)} />
      )}
      {isPrepareOpen && (
        <PrepareModal
          onClose={() => setIsPrepareOpen(false)}
          onStart={startFocus}
        />
      )}
    </main>
  )
}
