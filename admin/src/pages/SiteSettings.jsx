import { useEffect, useState } from 'react'
import { settingsService } from '../services/settings.service'
import { useToast } from '../context/ToastContext.jsx'
import { TextField } from '../components/FormField.jsx'
import ImageUpload from '../components/ImageUpload.jsx'
import { ChevronDown, ChevronUp, Save } from 'lucide-react'

// Accordion with its own Save button
const SettingsSection = ({ title, children, onSave, saving }) => {
  const [open, setOpen] = useState(false)

  const handleSave = async (e) => {
    e.stopPropagation()
    await onSave()
    setOpen(false) // Close after successful save
  }

  return (
    <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '18px 24px', userSelect: 'none' }}
        onClick={() => setOpen(!open)}
      >
        <h3 style={{ fontSize: 15, margin: 0, fontWeight: 600 }}>{title}</h3>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--color-border)', padding: '20px 24px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {children}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <button
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px' }}
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={15} />
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SiteSettings() {
  const toast = useToast()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState('')

  useEffect(() => { settingsService.get().then(setForm) }, [])
  if (!form) return <div className="skeleton" style={{ height: 400 }} />

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const saveSection = async (sectionKey) => {
    setSaving(sectionKey)
    try {
      const next = await settingsService.update(form)
      setForm(next)
      toast.success('Saved!')
    } catch {
      toast.error('Could not save')
    } finally {
      setSaving('')
    }
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div className="page-head">
        <div>
          <h1>Site Settings</h1>
          <p>Click a section to expand and edit. Save each section individually.</p>
        </div>
      </div>

      <div style={{ maxWidth: 650 }}>

        <SettingsSection title="Branding & Assets" onSave={() => saveSection('branding')} saving={saving === 'branding'}>
          <TextField label="Site name" value={form.siteName || ''} onChange={(e) => set('siteName', e.target.value)} />
          <ImageUpload label="Header logo" value={form.logo || ''} onChange={(v) => set('logo', v)} />
          <ImageUpload label="Footer logo" value={form.footerLogo || ''} onChange={(v) => set('footerLogo', v)} />
          <ImageUpload label="Enquiry section side image (Boy jumping)" value={form.enquiry_image || ''} onChange={(v) => set('enquiry_image', v)} />
        </SettingsSection>

        <SettingsSection title="Contact Info" onSave={() => saveSection('contact')} saving={saving === 'contact'}>
          <TextField label="Phone number(s)" value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} />
          <TextField label="Email" type="email" value={form.email || ''} onChange={(e) => set('email', e.target.value)} />
        </SettingsSection>

        <SettingsSection title="Social Media Links" onSave={() => saveSection('social')} saving={saving === 'social'}>
          <TextField label="Facebook URL" value={form.facebook || ''} onChange={(e) => set('facebook', e.target.value)} />
          <TextField label="Instagram URL" value={form.instagram || ''} onChange={(e) => set('instagram', e.target.value)} />
          <TextField label="YouTube URL" value={form.youtube || ''} onChange={(e) => set('youtube', e.target.value)} />
        </SettingsSection>

      </div>
    </div>
  )
}
