import { useEffect, useState } from 'react'
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react'
import { homepageService } from '../services/homepage.service'
import { bannerService } from '../services/banner.service'
import { eventsService } from '../services/events.service'
import { aboutService } from '../services/about.service'
import { useToast } from '../context/ToastContext.jsx'
import { TextField, TextArea } from '../components/FormField.jsx'
import ImageUpload from '../components/ImageUpload.jsx'
import Switch from '../components/Switch.jsx'

const TABS = ['Hero Slider', 'About Preview', 'Benefits']

const PAGE_LINK_OPTIONS = [
  { value: '/contact', label: 'Contact Us (/contact)' },
  { value: '/about', label: 'About Us (/about)' },
  { value: '/event', label: 'Events (/event)' },
  { value: '/blog', label: 'Blog (/blog)' },
  { value: '/', label: 'Home Page (/)' },
  { value: 'custom', label: 'Custom URL (Enter manual link)' },
]

function LinkSelectField({ label = 'Button link', value = '', onChange }) {
  const isPreset = PAGE_LINK_OPTIONS.some((p) => p.value === value && p.value !== 'custom')
  const [mode, setMode] = useState(isPreset ? value : (value ? 'custom' : '/contact'))

  useEffect(() => {
    const preset = PAGE_LINK_OPTIONS.some((p) => p.value === value && p.value !== 'custom')
    setMode(preset ? value : (value ? 'custom' : '/contact'))
  }, [value])

  const handleSelectChange = (e) => {
    const selected = e.target.value
    setMode(selected)
    if (selected !== 'custom') {
      onChange(selected)
    }
  }

  return (
    <div className="field">
      <label>{label}</label>
      <select
        className="select"
        value={mode}
        onChange={handleSelectChange}
      >
        {PAGE_LINK_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {mode === 'custom' && (
        <input
          className="input"
          style={{ marginTop: 8 }}
          placeholder="e.g. /custom-url or https://..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7) }

export default function HomepageManagement({ defaultTab }) {
  const toast = useToast()
  const [data, setData] = useState(null)
  const [slidesData, setSlidesData] = useState([])
  const [aboutData, setAboutData] = useState(null)
  const [eventsList, setEventsList] = useState([])
  const [tab, setTab] = useState(defaultTab || TABS[0])

  useEffect(() => {
    if (defaultTab) setTab(defaultTab)
  }, [defaultTab])
  const [savingTarget, setSavingTarget] = useState(null)

  useEffect(() => {
    homepageService.get().then(setData)
    bannerService.get().then(setSlidesData)
    aboutService.get().then(setAboutData).catch(console.error)
    eventsService.list().then(setEventsList).catch(console.error)
  }, [])

  if (!data || !aboutData) return <div className="skeleton" style={{ height: 300 }} />

  const save = async (patch, target = 'homepage') => {
    setSavingTarget(target)
    try {
      const nextData = { ...data, ...patch }
      await homepageService.update(nextData)
      setData(nextData)
      toast.success('Homepage updated')
    } catch (err) {
      console.error('Save error:', err)
      toast.error('Could not save: ' + (err.response?.data?.message || err.message || 'Error'))
    } finally {
      setSavingTarget(null)
    }
  }

  const saveSlides = async (slides) => {
    setSavingTarget('slides')
    try {
      await bannerService.sync(slides)
      const refreshed = await bannerService.get()
      setSlidesData(refreshed)
      toast.success('Banner slides saved successfully!')
    } catch (err) {
      console.error('Save slides error:', err)
      toast.error('Could not save to banner table')
    } finally {
      setSavingTarget(null)
    }
  }

  const saveAbout = async (aboutForm) => {
    setSavingTarget('about')
    try {
      await aboutService.update(aboutForm)
      setAboutData(aboutForm)
      toast.success('About table synchronized')
    } catch (err) {
      console.error('Save about error:', err)
      toast.error('Could not save to about table')
    } finally {
      setSavingTarget(null)
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Homepage Management</h1>
          <p>Every editable section of the homepage — hero slider, about preview, stats and benefits.</p>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <div key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</div>
        ))}
      </div>

      {tab === 'Hero Slider' && <SlidesEditor slides={slidesData} onSave={(slides) => saveSlides(slides)} saving={savingTarget === 'slides'} />}
      {tab === 'About Preview' && <AboutPreviewEditor about={aboutData} onSave={(about) => saveAbout(about)} saving={savingTarget === 'about'} />}
      {tab === 'Benefits' && (
        <>
          <BenefitsHeaderEditor
            benefitsMeta={data.benefitsMeta || {}}
            onSave={(meta) => save({ benefitsMeta: meta }, 'benefitsMeta')}
            saving={savingTarget === 'benefitsMeta'}
          />
          <h3 style={{ fontSize: 16, marginBottom: 12, marginTop: 12 }}>Floating Benefit Items</h3>
          <ListEditor
            items={data.benefits || []}
            onSave={(benefits) => save({ benefits }, 'benefits')}
            saving={savingTarget === 'benefits'}
            empty={{ number: '00', title: '', description: '' }}
            renderFields={(item, update) => (
              <>
                <TextField label="Number" value={item.number} onChange={(e) => update({ number: e.target.value })} />
                <TextField label="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
                <TextArea label="Description" value={item.description} onChange={(e) => update({ description: e.target.value })} />
              </>
            )}
            title={(item) => item.title || 'Untitled benefit'}
          />
        </>
      )}
    </div>
  )
}

function BenefitsHeaderEditor({ benefitsMeta, onSave, saving }) {
  const [form, setForm] = useState(benefitsMeta)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => setForm(benefitsMeta), [benefitsMeta])
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="card" style={{ padding: 20, marginBottom: 20 }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, cursor: 'pointer' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        Section Header & Center Media {form.title ? `- ${form.title}` : ''}
      </div>

      {isExpanded && (
        <div style={{ marginTop: 16 }}>
          <div className="field-row">
            <TextField label="Subtitle" value={form.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} />
            <TextField label="Title" value={form.title || ''} onChange={(e) => set('title', e.target.value)} />
          </div>
          <ImageUpload label="Center Circle Image/Video URL (.jpg, .mp4, etc)" value={form.media || ''} onChange={(v) => set('media', v)} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsExpanded(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { onSave(form); setIsExpanded(false); }}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save Section Info'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SlidesEditor({ slides, onSave, saving }) {
  const [rows, setRows] = useState(slides)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => setRows(slides), [slides])

  const update = (id, patch) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const remove = (id) => setRows((rs) => rs.filter((r) => r.id !== id))
  const add = () => {
    const newId = uid()
    setRows((rs) => [...rs, {
      id: newId, subtitle: '', title: '', description: '', ctaLabel: 'Join our club', ctaLink: '/contact',
      image: '', eventImage: '', eventTag: '', eventDate: '', eventTime: '', eventLocation: '', order: rs.length, enabled: true,
    }])
    setExpandedId(newId)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 13 }}>
          Click <strong>Add slide</strong> to create a new banner, or click any slide below to edit and save it.
        </p>
        <button className="btn btn-primary" onClick={add}>
          <Plus size={16} /> Add slide
        </button>
      </div>

      {rows.map((s, i) => {
        const isExpanded = expandedId === s.id;
        return (
          <div key={s.id} className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? 16 : 0 }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, cursor: 'pointer', flex: 1 }}
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
              >
                <GripVertical size={16} className="drag-handle" />
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                Slide {i + 1} {s.title ? `- ${s.title}` : ''}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Switch checked={s.enabled} onChange={(v) => update(s.id, { enabled: v })} />
                <button className="btn btn-ghost btn-icon" onClick={() => remove(s.id)}><Trash2 size={16} color="var(--color-danger)" /></button>
              </div>
            </div>

            {isExpanded && (
              <>
                <div className="field-row">
                  <TextField label="Subtitle" value={s.subtitle} onChange={(e) => update(s.id, { subtitle: e.target.value })} />
                  <TextField label="Title" value={s.title} onChange={(e) => update(s.id, { title: e.target.value })} />
                </div>
                <TextArea label="Description" value={s.description || ''} onChange={(e) => update(s.id, { description: e.target.value })} />
                <ImageUpload label="Slide Banner Image" value={s.image} onChange={(v) => update(s.id, { image: v })} />
                <div className="field-row">
                  <TextField label="Button label" value={s.ctaLabel} onChange={(e) => update(s.id, { ctaLabel: e.target.value })} />
                  <LinkSelectField label="Button link" value={s.ctaLink} onChange={(val) => update(s.id, { ctaLink: val })} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setExpandedId(null)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => { onSave(rows); setExpandedId(null); }}
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Save slide'}
                  </button>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

function AboutPreviewEditor({ about, onSave, saving }) {
  const [form, setForm] = useState(about)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => setForm(about), [about])
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="card" style={{ padding: 20 }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, cursor: 'pointer' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        Homepage &apos;About&apos; Block Settings {form.title ? `- ${form.title}` : ''}
      </div>

      {isExpanded && (
        <div style={{ marginTop: 16 }}>
          <div className="field-row">
            <TextField label="Sub-title" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
            <TextField label="Heading" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <TextArea label="Body copy" value={form.body} onChange={(e) => set('body', e.target.value)} />
          <ImageUpload label="Image" value={form.image} onChange={(v) => set('image', v)} />
          <div className="field-row">
            <TextField label="Button label" value={form.buttonLabel} onChange={(e) => set('buttonLabel', e.target.value)} />
            <LinkSelectField label="Button link" value={form.buttonLink} onChange={(val) => set('buttonLink', val)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsExpanded(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { onSave(form); setIsExpanded(false); }}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ListEditor({ items, onSave, saving, empty, renderFields, title }) {
  const [rows, setRows] = useState(items || [])
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => setRows(items || []), [items])
  const update = (id, patch) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const remove = (id) => setRows((rs) => rs.filter((r) => r.id !== id))
  const add = () => {
    const newId = uid()
    setRows((rs) => [...rs, { id: newId, order: rs.length, ...empty }])
    setExpandedId(newId)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 13 }}>
          Manage items below. Click any item to edit and save it.
        </p>
        <button className="btn btn-primary" onClick={add}>
          <Plus size={16} /> Add item
        </button>
      </div>

      {rows.map((item, i) => {
        const isExpanded = expandedId === item.id;
        return (
          <div key={item.id} className="card" style={{ padding: 18, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isExpanded ? 10 : 0 }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, cursor: 'pointer', flex: 1 }}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <GripVertical size={16} className="drag-handle" />
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                {title(item) || `Item ${i + 1}`}
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => remove(item.id)}><Trash2 size={16} color="var(--color-danger)" /></button>
            </div>
            {isExpanded && (
              <>
                <div className="field-row">{renderFields(item, (patch) => update(item.id, patch))}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--color-border)' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setExpandedId(null)}>Close</button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => { onSave(rows); setExpandedId(null); }}
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Save item'}
                  </button>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
