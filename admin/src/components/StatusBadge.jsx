const MAP = {
  published: 'badge-success',
  active: 'badge-success',
  enabled: 'badge-success',
  draft: 'badge-warning',
  inactive: 'badge-muted',
  disabled: 'badge-muted',
  archived: 'badge-danger',
  upcoming: 'badge-warning',
  ongoing: 'badge-success',
  ended: 'badge-muted',
}

export default function StatusBadge({ status }) {
  const cls = MAP[status] || 'badge-muted'
  return <span className={`badge ${cls}`}>{status}</span>
}
