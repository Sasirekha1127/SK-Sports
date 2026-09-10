import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Newspaper, Users, Mail, Quote } from 'lucide-react'
import { eventsService } from '../services/events.service'
import { blogService } from '../services/blog.service'
import { teamService } from '../services/team.service'
import { messagesService } from '../services/messages.service'
import { testimonialsService } from '../services/testimonials.service'

function StatCard({ icon: Icon, label, value, to }) {
  const body = (
    <div className="card stat-card">
      <div className="icon-wrap"><Icon size={18} /></div>
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
  )
  return to ? <Link to={to}>{body}</Link> : body
}

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all([
      eventsService.list(),
      blogService.list(),
      teamService.list(),
      messagesService.list(),
      testimonialsService.list(),
    ]).then(([events, blog, team, messages, testimonials]) => {
      setData({ events, blog, team, messages, testimonials })
    })
  }, [])

  if (!data) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100 }} />)}
      </div>
    )
  }

  const { events, blog, team, messages, testimonials } = data
  const unreadMessages = messages.filter((m) => !m.read).length
  const upcoming = [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5)
  const recentMessages = [...messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your SK Sports website content.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon={CalendarDays} label="Total Events" value={events.length} to="/events" />
        <StatCard icon={Newspaper} label="Total Blog Posts" value={blog.length} to="/blog" />
        <StatCard icon={Users} label="Team Members" value={team.length} to="/team" />
        <StatCard icon={Quote} label="Testimonials" value={testimonials.length} to="/testimonials" />
        <StatCard icon={Mail} label="Unread Messages" value={unreadMessages} to="/messages" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="dash-grid">
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15 }}>Upcoming Events</h3>
            <Link to="/events" style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>View all</Link>
          </div>
          {upcoming.length === 0 ? <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>No events yet.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcoming.map((e) => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{e.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{e.location}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{e.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15 }}>Recent Contact Messages</h3>
            <Link to="/messages" style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>View all</Link>
          </div>
          {recentMessages.length === 0 ? <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>No messages yet.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentMessages.map((m) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{m.name} {!m.read && <span className="badge badge-warning" style={{ marginLeft: 6 }}>new</span>}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
