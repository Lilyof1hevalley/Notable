import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddTaskModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [folder, setFolder] = useState('Discrete Math')
  const [weight, setWeight] = useState(5)
  const [effort, setEffort] = useState(5)
  const [focused, setFocused] = useState(null)

  const folders = ['Discrete Math', 'Physics', 'Calculus', 'Software Eng', 'Chemistry', 'Statistics']

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !deadline) return
    onAdd?.({ title, deadline, folder, academic_weight: weight, estimated_effort: effort })
    onClose?.()
  }

  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: focused === field ? '#1A1A1A' : '#E5E5E5',
  })

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div style={styles.modal}>

        {/* Header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Add Task</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Task title */}
          <div style={styles.field}>
            <label style={styles.label}>Task Title</label>
            <input
              type="text"
              placeholder="e.g. Review Chapter 3"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onFocus={() => setFocused('title')}
              onBlur={() => setFocused(null)}
              style={inputStyle('title')}
              required
              autoFocus
            />
          </div>

          {/* Deadline */}
          <div style={styles.field}>
            <label style={styles.label}>Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              onFocus={() => setFocused('deadline')}
              onBlur={() => setFocused(null)}
              style={inputStyle('deadline')}
              required
            />
          </div>

          {/* Folder */}
          <div style={styles.field}>
            <label style={styles.label}>Notebook / Folder</label>
            <select
              value={folder}
              onChange={e => setFolder(e.target.value)}
              onFocus={() => setFocused('folder')}
              onBlur={() => setFocused(null)}
              style={{ ...inputStyle('folder'), cursor: 'pointer' }}
            >
              {folders.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Academic weight slider */}
          <div style={styles.field}>
            <div style={styles.sliderLabelRow}>
              <label style={styles.label}>Academic Weight</label>
              <span style={styles.sliderValue}>{weight} / 10</span>
            </div>
            <input
              type="range" min="1" max="10" value={weight}
              onChange={e => setWeight(Number(e.target.value))}
              style={styles.slider}
            />
            <div style={styles.sliderHint}>How important is this to your grade?</div>
          </div>

          {/* Effort slider */}
          <div style={styles.field}>
            <div style={styles.sliderLabelRow}>
              <label style={styles.label}>Estimated Effort</label>
              <span style={styles.sliderValue}>{effort} / 10</span>
            </div>
            <input
              type="range" min="1" max="10" value={effort}
              onChange={e => setEffort(Number(e.target.value))}
              style={styles.slider}
            />
            <div style={styles.sliderHint}>How much effort will this take?</div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={styles.submitBtn}>Add Task</button>
          </div>

        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
    fontFamily: "'Inter', sans-serif",
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxWidth: 440,
    padding: '28px 32px 32px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: "'Inria Sans', serif",
    fontStyle: 'italic', fontWeight: 400, fontSize: 22,
    color: '#1A1A1A', margin: 0,
  },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 16, color: '#888', padding: 4, lineHeight: 1,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontSize: 11, fontWeight: 600, color: '#1A1A1A',
    letterSpacing: '0.07em', textTransform: 'uppercase',
  },
  input: {
    padding: '11px 14px',
    fontSize: 14, color: '#1A1A1A',
    backgroundColor: '#F5F4F1',
    border: '1.5px solid #E5E5E5',
    borderRadius: 8, outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.15s',
    width: '100%', boxSizing: 'border-box',
  },
  sliderLabelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sliderValue: { fontSize: 13, fontWeight: 600, color: '#1A1A1A' },
  slider: { width: '100%', accentColor: '#1A1A1A', cursor: 'pointer' },
  sliderHint: { fontSize: 11, color: '#999', marginTop: 2 },
  actions: { display: 'flex', gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1, padding: '12px',
    background: 'none', border: '1.5px solid #E5E5E5',
    borderRadius: 8, fontSize: 13, fontWeight: 500,
    color: '#555', cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  submitBtn: {
    flex: 2, padding: '12px',
    backgroundColor: '#1A1A1A', border: 'none',
    borderRadius: 8, fontSize: 13, fontWeight: 700,
    color: '#FFFFFF', cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.05em',
  },
}