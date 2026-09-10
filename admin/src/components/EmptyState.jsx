import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action }) {
  return (
    <div className="empty-state">
      <Icon size={34} style={{ marginBottom: 12, opacity: 0.5 }} />
      <h3>{title}</h3>
      {description && <p style={{ maxWidth: 360, fontSize: 14 }}>{description}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  )
}
