import Modal from './Modal.jsx'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
  open, title = 'Are you sure?', description, confirmLabel = 'Delete', cancelLabel = 'Cancel',
  danger = true, onConfirm, onCancel, loading,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      width={400}
      footer={
        <>
          <button className="btn btn-outline" onClick={onCancel} disabled={loading}>{cancelLabel}</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm} disabled={loading}>
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 12 }}>
        {danger && <AlertTriangle size={20} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: 2 }} />}
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, lineHeight: 1.5 }}>{description}</p>
      </div>
    </Modal>
  )
}
