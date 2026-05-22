import { useNavigate } from 'react-router-dom'
import Modal from '../../../shared/components/ui/Modal'

function FocusSummaryModal({ onClose, summary }) {
  const navigate = useNavigate()
  const isOpen = Boolean(summary)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Focus Session">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#68768D', fontFamily: "'Inter', sans-serif" }}>
          Ready to start a focus session?
        </p>
        <button
          onClick={() => { onClose(); navigate('/focus-session') }}
          style={{
            padding: '10px 16px',
            background: '#1A1A1A',
            color: '#FFF',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}
          type="button"
        >
          Go to Focus Session
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '10px 16px',
            background: 'transparent',
            color: '#1A1A1A',
            border: '1px solid #E5E5E5',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}
          type="button"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default FocusSummaryModal