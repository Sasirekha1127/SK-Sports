import { useEffect, useMemo, useState } from 'react'
import { Mail, Search, Trash2, MailOpen, Mail as MailIcon, Phone, Clock, ArrowLeft } from 'lucide-react'
import { registrationsService } from '../services/registrations.service'
import { useToast } from '../context/ToastContext.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

export default function Registrations() {
  const toast = useToast()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [activeMessage, setActiveMessage] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    registrationsService.list().then((data) => {
      setMessages(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      setLoading(false)
    })
  }
  useEffect(load, [])

  const filtered = useMemo(() => {
    let rows = messages
    if (filter === 'unread') rows = rows.filter((m) => !m.read)
    if (filter === 'read') rows = rows.filter((m) => m.read)
    if (query.trim()) {
      const q = query.toLowerCase()
      rows = rows.filter((m) => [m.name, m.email, m.message].some((v) => v.toLowerCase().includes(q)))
    }
    return rows
  }, [messages, query, filter])

  const openMessage = async (m) => {
    setActiveMessage(m)
    if (!m.read) {
      await registrationsService.markRead(m.id, true)
      setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, read: true } : msg))
    }
  }

  const toggleRead = async (m) => {
    const newReadStatus = !m.read
    await registrationsService.markRead(m.id, newReadStatus)
    setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, read: newReadStatus } : msg))
    if (activeMessage?.id === m.id) {
      setActiveMessage({ ...activeMessage, read: newReadStatus })
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await registrationsService.remove(confirmTarget.id)
      toast.success('Message deleted')
      setMessages(prev => prev.filter(msg => msg.id !== confirmTarget.id))
      if (activeMessage?.id === confirmTarget.id) {
        setActiveMessage(null)
      }
      setConfirmTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.charAt(0).toUpperCase()
  }

  const formatShortDate = (dateString) => {
    const d = new Date(dateString)
    const now = new Date()
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const formatLongDate = (dateString) => {
    return new Date(dateString).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Registrations</h1>
          <p>Manage website academy registrations.</p>
        </div>
      </div>

      <div className="inbox-wrapper">
        {/* Sidebar List */}
        <div className={`inbox-sidebar ${activeMessage ? 'hidden-on-mobile' : ''}`}>
          <div className="inbox-sidebar-header">
            <div className="search-box" style={{ width: '100%', maxWidth: 'none', margin: 0 }}>
              <Search size={15} />
              <input className="input" placeholder="Search messages…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          <div className="inbox-list">
            {loading ? (
              <div style={{ padding: 20 }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 70, marginBottom: 16 }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <MailIcon size={32} style={{ marginBottom: 10, opacity: 0.5 }} />
                <p>No messages found.</p>
              </div>
            ) : (
              filtered.map((m) => (
                <div
                  key={m.id}
                  className={`inbox-item ${!m.read ? 'unread' : ''} ${activeMessage?.id === m.id ? 'active' : ''}`}
                  onClick={() => openMessage(m)}
                >
                  <div className="inbox-item-avatar">
                    {getInitials(m.name)}
                  </div>
                  <div className="inbox-item-content">
                    <div className="inbox-item-header">
                      <div className="inbox-item-name">{m.name}</div>
                      <div className="inbox-item-date">{formatShortDate(m.createdAt)}</div>
                    </div>
                    <div className="inbox-item-subject">{m.phone}</div>
                    <div className="inbox-item-preview">
                      <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{m.sport || 'Badminton'}</span>
                      {m.skill_level ? ` • ${m.skill_level}` : ''}
                      {m.gender ? ` • ${m.gender}` : ''}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content Pane */}
        <div className={`inbox-main ${!activeMessage ? 'hidden-on-mobile' : ''}`}>
          {!activeMessage ? (
            <div className="inbox-main-empty">
              <MailIcon size={48} strokeWidth={1} />
              <h3>Select a message</h3>
              <p>Choose a message from the list to view its contents.</p>
            </div>
          ) : (
            <>
              <div className="inbox-main-header">
                <style>{`
                  @media (max-width: 900px) {
                    .hidden-on-mobile { display: none !important; }
                    .mobile-back-btn { display: inline-flex !important; margin-right: 12px; }
                  }
                  .mobile-back-btn { display: none; }
                `}</style>
                <div className="inbox-sender-info">
                  <button className="btn btn-ghost btn-icon mobile-back-btn" onClick={() => setActiveMessage(null)}>
                    <ArrowLeft size={18} />
                  </button>
                  <div className="inbox-sender-avatar">
                    {getInitials(activeMessage.name)}
                  </div>
                  <div className="inbox-sender-details">
                    <h2>{activeMessage.name}</h2>
                    <p><MailIcon size={14} /> <a href={`mailto:${activeMessage.email}`} style={{ textDecoration: 'underline' }}>{activeMessage.email || 'No email provided'}</a></p>
                    <p><Phone size={14} /> {activeMessage.phone || 'No phone provided'}</p>
                    <p><Clock size={14} /> {formatLongDate(activeMessage.createdAt)}</p>
                  </div>
                </div>
                <div className="inbox-main-actions">
                  <button
                    className="btn btn-outline btn-icon"
                    onClick={() => toggleRead(activeMessage)}
                    title={activeMessage.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {!activeMessage.read ? <MailOpen size={16} /> : <Mail size={16} />}
                  </button>
                  <button
                    className="btn btn-outline btn-icon"
                    onClick={() => setConfirmTarget(activeMessage)}
                    title="Delete message"
                  >
                    <Trash2 size={16} color="var(--color-danger)" />
                  </button>
                  {activeMessage.email && (
                    <a href={`mailto:${activeMessage.email}`} className="btn btn-primary" style={{ marginLeft: 8 }}>
                      Reply
                    </a>
                  )}
                </div>
              </div>
              <div className="inbox-main-body" style={{ padding: '24px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  background: 'var(--color-surface, #f8fafc)',
                  padding: '18px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border, #e2e8f0)',
                  marginBottom: '20px'
                }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>🏸 Sport</span>
                    <strong style={{ fontSize: '15px' }}>{activeMessage.sport || 'Badminton'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>📊 Skill Level</span>
                    <strong style={{ fontSize: '15px' }}>{activeMessage.skill_level || 'Beginner'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>⏰ Preferred Time</span>
                    <strong style={{ fontSize: '15px' }}>{activeMessage.training_time || 'Flexible'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>📅 Date of Birth</span>
                    <strong style={{ fontSize: '15px' }}>{activeMessage.dob || 'Not specified'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>🚻 Gender</span>
                    <strong style={{ fontSize: '15px', textTransform: 'capitalize' }}>{activeMessage.gender || 'Not specified'}</strong>
                  </div>
                </div>

                {activeMessage.message ? (
                  <div style={{
                    background: 'var(--color-surface, #f8fafc)',
                    padding: '16px 18px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border, #e2e8f0)'
                  }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '6px' }}>💬 Message / Additional Requirements</span>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{activeMessage.message}</p>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this message?"
        description="This will permanently remove the message. This action cannot be undone."
        onCancel={() => setConfirmTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div >
  )
}
