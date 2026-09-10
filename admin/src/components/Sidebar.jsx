import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Home, Info, CalendarDays, Newspaper, Users, Quote,
  Handshake, ShoppingBag, Mail, Settings2, Dumbbell, ClipboardList, LayoutList,
  KeyRound
} from 'lucide-react'

const nav = [
  { section: null, items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true }] },
  {
    section: 'Website',
    items: [
      { to: '/homepage', label: 'Homepage', icon: Home },
      { to: '/about', label: 'About Page', icon: Info },
    ],
  },
  {
    section: 'Content',
    items: [
      { to: '/events', label: 'Events', icon: CalendarDays },
      { to: '/blog', label: 'Blog', icon: Newspaper },
      { to: '/team', label: 'Team / Coaches', icon: Users },
      { to: '/testimonials', label: 'Testimonials', icon: Quote }
    ],
  },
  {
    section: 'Messages & Forms',
    items: [
      { to: '/messages', label: 'Contact Messages', icon: Mail },
      { to: '/registrations', label: 'Registrations', icon: ClipboardList }
    ],
  },
  {
    section: 'Settings',
    items: [
      { to: '/footer', label: 'Footer', icon: LayoutList },
      { to: '/settings', label: 'Site Settings', icon: Settings2 },
    ],
  },
  {
    section: 'Admin',
    items: [
      { to: '/admin-password', label: 'Create New Password', icon: KeyRound },
    ],
  },
]

export default function Sidebar({ open, onNavigate }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <img
            src="logo.png"
            alt="SK Sports"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div>
          <div className="sidebar-brand-name">SK Sports</div>
          <div className="sidebar-brand-sub">Admin Panel</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {nav.map((group, i) => (
          <div key={i} className="sidebar-group">
            {group.section && <div className="sidebar-section">{group.section}</div>}
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
