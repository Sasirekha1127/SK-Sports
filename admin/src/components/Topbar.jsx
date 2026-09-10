import { useState } from 'react'
import { Menu, LogOut, User, KeyRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from './ConfirmDialog.jsx'

export default function Topbar({ onToggleSidebar, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    setShowLogoutConfirm(false)
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="topbar">
        <button className="btn-ghost sidebar-toggle" onClick={onToggleSidebar} aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <div className="topbar-title">{title}</div>
        <div className="topbar-user">
          <div
            className="topbar-avatar"
            style={{ cursor: 'pointer' }}
            title="Change Password"
            onClick={() => navigate('/admin-password')}
          >
            <User size={16} />
          </div>
          <div
            className="topbar-user-meta"
            style={{ cursor: 'pointer' }}
            title="Change Password"
            onClick={() => navigate('/admin-password')}
          >
            <div className="name">{user?.name}</div>
            <div className="role">{user?.role}</div>
          </div>
          <button
            className="btn btn-ghost btn-icon"
            title="Create / Change Password"
            onClick={() => navigate('/admin-password')}
          >
            <KeyRound size={17} />
          </button>
          <button
            className="btn btn-ghost btn-icon"
            title="Log out"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Confirm Logout"
        description="Are you sure you want to log out of the SK Sports Admin Dashboard?"
        confirmLabel="Yes, Log Out"
        cancelLabel="No, Stay"
        danger={true}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  )
}
