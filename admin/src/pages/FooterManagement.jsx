import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext.jsx'
import { TextField, TextArea } from '../components/FormField.jsx'
import ImageUpload from '../components/ImageUpload.jsx'
import { http } from '../services/httpClient'
import { Save, ChevronDown, ChevronUp } from 'lucide-react'

// Accordion section with its own save button
const Section = ({ title, children, onSave, saving }) => {
    const [open, setOpen] = useState(false)

    const handleSave = async (e) => {
        e.stopPropagation()
        await onSave()
        setOpen(false)
    }

    return (
        <div className="card" style={{ marginBottom: 14, overflow: 'hidden' }}>
            <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '16px 20px', userSelect: 'none' }}
                onClick={() => setOpen(o => !o)}
            >
                <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{title}</h3>
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            {open && (
                <div style={{ borderTop: '1px solid var(--color-border)', padding: '18px 20px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {children}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
                        <button
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px' }}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <Save size={14} />
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function FooterManagement() {
    const toast = useToast()

    // Footer-specific data
    const [footer, setFooter] = useState(null)
    // Site-wide data (logo, phone, social)
    const [site, setSite] = useState(null)

    const [savingSection, setSavingSection] = useState('')

    useEffect(() => {
        http.get('/admin/footer-settings').then(r => setFooter(r.data)).catch(console.error)
        http.get('/admin/settings').then(r => setSite(r.data)).catch(console.error)
    }, [])

    if (!footer || !site) return <div className="skeleton" style={{ height: 400 }} />

    const setF = (k, v) => setFooter(f => ({ ...f, [k]: v }))
    const setS = (k, v) => setSite(s => ({ ...s, [k]: v }))

    const saveFooter = async (section) => {
        setSavingSection(section)
        try {
            const r = await http.put('/admin/footer-settings', footer)
            setFooter(r.data)
            toast.success('Saved!')
        } catch { toast.error('Could not save') }
        finally { setSavingSection('') }
    }

    const saveSite = async (section) => {
        setSavingSection(section)
        try {
            const next = await http.put('/admin/settings', site)
            setSite(next.data || next)
            toast.success('Saved!')
        } catch { toast.error('Could not save') }
        finally { setSavingSection('') }
    }

    return (
        <div style={{ paddingBottom: 40 }}>
            <div className="page-head">
                <div>
                    <h1>Footer</h1>
                    <p>Manage every section that appears in the website footer. Click a section to expand and edit.</p>
                </div>
            </div>

            <div style={{ maxWidth: 640 }}>

                {/* Logo */}
                <Section title="Logo" onSave={() => saveSite('logo')} saving={savingSection === 'logo'}>
                    <ImageUpload label="Footer Logo" value={site.footerLogo} onChange={v => setS('footerLogo', v)} />
                </Section>

                {/* Description */}
                <Section title="About Description (text below logo)" onSave={() => saveFooter('desc')} saving={savingSection === 'desc'}>
                    <TextArea label="Description" value={footer.description || ''} onChange={e => setF('description', e.target.value)} rows={4} />
                </Section>

                {/* Social Media */}
                <Section title="Social Media Links" onSave={() => saveSite('social')} saving={savingSection === 'social'}>
                    <TextField label="Facebook URL" value={site.facebook || ''} onChange={e => setS('facebook', e.target.value)} />
                    <TextField label="Instagram URL" value={site.instagram || ''} onChange={e => setS('instagram', e.target.value)} />
                    <TextField label="YouTube URL" value={site.youtube || ''} onChange={e => setS('youtube', e.target.value)} />
                </Section>

                {/* Quick Links — these are static navigation links, just shown for reference */}
                <Section title="Quick Links (auto from navigation)" onSave={() => Promise.resolve()} saving={false}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                        Quick Links (About Us, Our Event, Latest News, Contact Us) are pulled automatically from the site navigation.
                        To update them, go to <strong>Settings → Navigation</strong>.
                    </p>
                </Section>

                {/* Academy Timings */}
                <Section title="Academy Timings" onSave={() => saveFooter('timings')} saving={savingSection === 'timings'}>
                    <TextField label="Monday" placeholder="5:00 am–10:00 pm" value={footer.mon_timing || ''} onChange={e => setF('mon_timing', e.target.value)} />
                    <TextField label="Tue–Sat (use | to separate morning & evening)" placeholder="5:00 am–10:00 pm" value={footer.tue_sat_timing || ''} onChange={e => setF('tue_sat_timing', e.target.value)} />
                    <TextField label="Sunday" placeholder="5:00 am–10:00 pm" value={footer.sun_timing || ''} onChange={e => setF('sun_timing', e.target.value)} />
                </Section>

                {/* Phone Number */}
                <Section title="Phone Number (Newsletter section)" onSave={() => saveSite('phone')} saving={savingSection === 'phone'}>
                    <TextField label="Phone number(s)" placeholder="8883422888, 978886004" value={site.phone || ''} onChange={e => setS('phone', e.target.value)} />
                </Section>

                {/* Address */}
                <Section title="Address" onSave={() => saveFooter('address')} saving={savingSection === 'address'}>
                    <TextArea label="Full address" value={footer.address || ''} onChange={e => setF('address', e.target.value)} rows={3} />
                </Section>

                {/* Copyright */}
                <Section title="Copyright" onSave={() => saveFooter('copy')} saving={savingSection === 'copy'}>
                    <TextField label="Copyright text" placeholder="©2026 SK Sports. All Rights Reserved." value={footer.copyright || ''} onChange={e => setF('copyright', e.target.value)} />
                </Section>

            </div>
        </div>
    )
}
