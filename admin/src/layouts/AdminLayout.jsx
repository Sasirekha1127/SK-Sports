import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import Topbar from '../components/Topbar.jsx'

const TITLES = {
  '/': 'Dashboard',
  '/homepage': 'Homepage Management',
  '/hero-slider': 'Hero Slider (Slide Bar)',
  '/about': 'About Page',
  '/events': 'Events',
  '/blog': 'Blog',
  '/team': 'Team / Coaches',
  '/testimonials': 'Testimonials',
  '/partners': 'Partner Logos',
  '/products': 'Products',
  '/messages': 'Contact Messages',
  '/media': 'Media Library',
  '/navigation': 'Navigation',
  '/settings': 'Site Settings',
  '/admin-password': 'Create / Change Password',
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = TITLES[location.pathname] || 'Admin'

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="main-area">
        <Topbar title={title} onToggleSidebar={() => setSidebarOpen((o) => !o)} />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
