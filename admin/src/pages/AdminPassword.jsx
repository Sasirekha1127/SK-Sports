import { useState, useEffect } from 'react'
import { KeyRound, Eye, EyeOff, ShieldCheck, Lock, Sparkles, Check, AlertCircle } from 'lucide-react'
import { adminUsersService } from '../services/adminUsers.service'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function AdminPassword() {
  const { user } = useAuth()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('my-password')

  // My password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [savingMyPwd, setSavingMyPwd] = useState(false)

  // Reset user password state
  const [adminList, setAdminList] = useState([])
  const [selectedAdminId, setSelectedAdminId] = useState('')
  const [targetNewPassword, setTargetNewPassword] = useState('')
  const [showTargetPwd, setShowTargetPwd] = useState(false)
  const [savingResetPwd, setSavingResetPwd] = useState(false)
  const [loadingAdmins, setLoadingAdmins] = useState(false)

  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    setLoadingAdmins(true)
    try {
      const data = await adminUsersService.list()
      setAdminList(data || [])
      if (data && data.length > 0 && !selectedAdminId) {
        setSelectedAdminId(data[0].id)
      }
    } catch (e) {
      console.error('Failed to load admin list:', e)
    } finally {
      setLoadingAdmins(false)
    }
  }

  // Calculate password strength
  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '#ccc' }
    let score = 0
    if (pwd.length >= 6) score += 1
    if (pwd.length >= 8) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1

    if (score <= 2) return { score: 1, label: 'Weak', color: '#e53e3e' }
    if (score <= 4) return { score: 2, label: 'Moderate', color: '#dd6b20' }
    return { score: 3, label: 'Strong', color: '#38a169' }
  }

  const handleUpdateMyPassword = async (e) => {
    e.preventDefault()
    if (!currentPassword) {
      toast.error('Please enter your current password')
      return
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match')
      return
    }

    setSavingMyPwd(true)
    try {
      await adminUsersService.changePassword({ currentPassword, newPassword })
      toast.success('Your password has been updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update password')
    } finally {
      setSavingMyPwd(false)
    }
  }

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*'
    let pwd = ''
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setTargetNewPassword(pwd)
    setShowTargetPwd(true)
    toast.success('Generated random secure password')
  }

  const handleResetUserPassword = async (e) => {
    e.preventDefault()
    if (!selectedAdminId) {
      toast.error('Please select an admin user')
      return
    }
    if (targetNewPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setSavingResetPwd(true)
    try {
      await adminUsersService.resetPassword({ id: selectedAdminId, newPassword: targetNewPassword })
      const selectedUser = adminList.find((u) => u.id === selectedAdminId)
      toast.success(`Password for ${selectedUser?.name || 'admin'} updated!`)
      setTargetNewPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to reset password')
    } finally {
      setSavingResetPwd(false)
    }
  }

  const strength = getStrength(newPassword)
  const selectedUserObj = adminList.find((u) => u.id === selectedAdminId)

  return (
    <div style={{ maxWidth: 780 }}>
      <div className="page-head">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <KeyRound size={24} style={{ color: 'var(--color-primary)' }} />
            Create / Change Password
          </h1>
          <p>Update your admin account credentials or set passwords for other administrator accounts.</p>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 24 }}>
        <div
          className={`tab-btn ${activeTab === 'my-password' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-password')}
        >
          My Password ({user?.name || 'Current Admin'})
        </div>
        <div
          className={`tab-btn ${activeTab === 'reset-admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('reset-admin')}
        >
          Reset / Set Admin Password
        </div>
      </div>

      {activeTab === 'my-password' && (
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{user?.name || 'Administrator'}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{user?.email} • {user?.role || 'Super Admin'}</div>
            </div>
          </div>

          <form onSubmit={handleUpdateMyPassword}>
            {/* Current Password */}
            <div className="field" style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500, marginBottom: 6 }}>Current Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ paddingRight: 40 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="field" style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500, marginBottom: 6 }}>New Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter new password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ paddingRight: 40 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength meter */}
              {newPassword && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, height: 4, borderRadius: 2, overflow: 'hidden', background: '#e2e8f0', marginBottom: 4 }}>
                    <div style={{ flex: 1, background: strength.score >= 1 ? strength.color : 'transparent' }} />
                    <div style={{ flex: 1, background: strength.score >= 2 ? strength.color : 'transparent' }} />
                    <div style={{ flex: 1, background: strength.score >= 3 ? strength.color : 'transparent' }} />
                  </div>
                  <div style={{ fontSize: 12, color: strength.color, fontWeight: 500 }}>
                    Password Strength: {strength.label}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="field" style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 500, marginBottom: 6 }}>Confirm New Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="input"
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingRight: 40 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && newPassword && (
                <div style={{ marginTop: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: confirmPassword === newPassword ? '#38a169' : '#e53e3e' }}>
                  {confirmPassword === newPassword ? (
                    <>
                      <Check size={14} /> Passwords match
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} /> Passwords do not match
                    </>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingMyPwd}
                style={{ minWidth: 160 }}
              >
                {savingMyPwd ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'reset-admin' && (
        <div className="card" style={{ padding: 28 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lock size={18} />
              Set / Reset Password for Any Admin
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              Choose an administrator account to overwrite or set a new password directly.
            </p>
          </div>

          <form onSubmit={handleResetUserPassword}>
            {/* Select Admin */}
            <div className="field" style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500, marginBottom: 6 }}>Select Admin User</label>
              <select
                className="input"
                value={selectedAdminId}
                onChange={(e) => setSelectedAdminId(e.target.value)}
                disabled={loadingAdmins || adminList.length === 0}
              >
                {adminList.map((adm) => (
                  <option key={adm.id} value={adm.id}>
                    {adm.name} ({adm.email}) - {adm.role || 'Admin'}
                  </option>
                ))}
              </select>
            </div>

            {selectedUserObj && (
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 8, marginBottom: 18, fontSize: 13, border: '1px solid #e2e8f0' }}>
                <div><strong>Selected:</strong> {selectedUserObj.name}</div>
                <div style={{ color: 'var(--color-text-muted)', marginTop: 2 }}><strong>Email:</strong> {selectedUserObj.email} | <strong>Role:</strong> {selectedUserObj.role}</div>
              </div>
            )}

            {/* Target New Password */}
            <div className="field" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontWeight: 500, marginBottom: 0 }}>New Password to Assign</label>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={generateRandomPassword}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', fontSize: 12 }}
                >
                  <Sparkles size={13} /> Generate Random
                </button>
              </div>

              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showTargetPwd ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter new password for this user"
                  value={targetNewPassword}
                  onChange={(e) => setTargetNewPassword(e.target.value)}
                  style={{ paddingRight: 40 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowTargetPwd(!showTargetPwd)}
                  style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
                >
                  {showTargetPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingResetPwd}
                style={{ minWidth: 160 }}
              >
                {savingResetPwd ? 'Setting Password…' : 'Save New Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
