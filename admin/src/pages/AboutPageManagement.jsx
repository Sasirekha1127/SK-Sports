import { useEffect, useState } from 'react'
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight, Target, Eye, Image as ImageIcon } from 'lucide-react'
import { aboutService } from '../services/about.service'
import { homepageService } from '../services/homepage.service'
import { useToast } from '../context/ToastContext.jsx'
import { TextField, TextArea } from '../components/FormField.jsx'
import ImageUpload from '../components/ImageUpload.jsx'

const TABS = ['Main Details', 'Mission & Vision', 'Stats / Counters']

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7) }

// Parse newline-separated points string to array
function parsePoints(str) {
  if (!str) return []
  return str.split('\n').map(s => s.trim()).filter(Boolean)
}

// Join array to newline-separated string
function joinPoints(arr) {
  return arr.join('\n')
}

export default function AboutPageManagement() {
  const toast = useToast()
  const [tab, setTab] = useState(TABS[0])

  const [form, setForm] = useState(null)
  const [counters, setCounters] = useState(null)
  const [saving, setSaving] = useState(false)

  // Edit/Close states for tabs
  const [editingMain, setEditingMain] = useState(false)
  const [editingMissionVision, setEditingMissionVision] = useState(false)

  useEffect(() => {
    aboutService.get().then(setForm).catch(console.error)
    homepageService.get().then(res => setCounters(res.counters || [])).catch(console.error)
  }, [])

  if (!form || !counters) return <div className="skeleton" style={{ height: 260 }} />

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const saveMainDetails = async () => {
    setSaving(true)
    try {
      await aboutService.update({ ...form })
      toast.success('Main Details updated')
      setEditingMain(false) // Automatically close form on update
    } catch {
      toast.error('Could not save')
    } finally {
      setSaving(false)
    }
  }

  const saveMissionVision = async () => {
    setSaving(true)
    try {
      await aboutService.update({ ...form })
      toast.success('Mission & Vision updated')
      setEditingMissionVision(false) // Automatically close form on update
    } catch {
      toast.error('Could not save')
    } finally {
      setSaving(false)
    }
  }

  const saveCounters = async (newCounters) => {
    setSaving(true)
    try {
      const fullState = await homepageService.get()
      await homepageService.update({ ...fullState, counters: newCounters })
      setCounters(newCounters)
      toast.success('Counters updated')
    } catch (err) {
      console.error('saveCounters error:', err?.response?.data || err?.message || err)
      const msg = err?.response?.data?.message || err?.message || 'Could not save counters'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>About Page</h1>
          <p>Manage content shown on the /about page — main details, mission, vision, and stats.</p>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <div key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</div>
        ))}
      </div>

      {/* ── MAIN DETAILS ── */}
      {tab === 'Main Details' && (
        <div className="card" style={{ padding: 20, maxWidth: 640 }}>
          {!editingMain ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Main Details Overview</h3>
                <button className="btn btn-primary" onClick={() => setEditingMain(true)}>Edit Details</button>
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Subtitle:</strong>
                <p style={{ margin: '4px 0 12px 0', fontSize: '0.95rem' }}>{form.subtitle || <em>No subtitle set</em>}</p>
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Heading / Title:</strong>
                <p style={{ margin: '4px 0 12px 0', fontSize: '0.95rem' }}>{form.title || <em>No title set</em>}</p>
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)' }}>Body copy:</strong>
                <p style={{ margin: '4px 0 12px 0', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{form.body || <em>No body copy set</em>}</p>
              </div>
              {form.image && (
                <div>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: 6 }}>Image:</strong>
                  <img src={form.image} alt="Preview" style={{ maxWidth: 200, maxHeight: 120, borderRadius: 8, objectFit: 'cover' }} />
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Edit Main Details</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setEditingMain(false)}>Close</button>
              </div>
              <TextField label="Subtitle" value={form.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} />
              <TextField label="Heading / Title" value={form.title || ''} onChange={(e) => set('title', e.target.value)} />
              <TextArea label="Body copy (Multiple paragraphs separated by line breaks)" value={form.body || ''} onChange={(e) => set('body', e.target.value)} />
              <ImageUpload label="Image" value={form.image || ''} onChange={(v) => set('image', v)} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button className="btn btn-outline" onClick={() => setEditingMain(false)} disabled={saving}>Close</button>
                <button className="btn btn-primary" onClick={saveMainDetails} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MISSION & VISION ── */}
      {tab === 'Mission & Vision' && (
        <div>
          {!editingMissionVision ? (
            <div className="card" style={{ padding: 20, maxWidth: 900 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Mission & Vision Content</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                    Current content saved for the /about page. Click edit to modify.
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => setEditingMissionVision(true)}>
                  Edit Mission & Vision
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Mission Preview */}
                <div style={{ background: 'var(--color-bg-subtle, #f8f9fa)', padding: 18, borderRadius: 10, border: '1px solid var(--color-border, #eaeaea)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Target size={18} style={{ color: 'var(--color-primary)' }} />
                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{form.mission_title || 'Our Mission'}</h4>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-body)', lineHeight: 1.5, marginBottom: 12 }}>
                    {form.mission_body || <em style={{ color: 'var(--color-muted)' }}>No description added yet.</em>}
                  </p>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-muted)', marginBottom: 6 }}>Bullet Points:</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.85rem' }}>
                    {(form.mission_points ? form.mission_points.split('\n').map(s => s.trim()).filter(Boolean) : []).map((pt, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* Vision Preview */}
                <div style={{ background: 'var(--color-bg-subtle, #f8f9fa)', padding: 18, borderRadius: 10, border: '1px solid var(--color-border, #eaeaea)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Eye size={18} style={{ color: 'var(--color-primary)' }} />
                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{form.vision_title || 'Our Vision'}</h4>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-body)', lineHeight: 1.5, marginBottom: 12 }}>
                    {form.vision_body || <em style={{ color: 'var(--color-muted)' }}>No description added yet.</em>}
                  </p>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-muted)', marginBottom: 6 }}>Bullet Points:</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.85rem' }}>
                    {(form.vision_points ? form.vision_points.split('\n').map(s => s.trim()).filter(Boolean) : []).map((pt, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Images Preview */}
              <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--color-border, #eaeaea)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <ImageIcon size={18} style={{ color: 'var(--color-primary)' }} />
                  <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>Showcase Images (Left side of Mission & Vision)</h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: 'var(--color-bg-subtle, #f8f9fa)', padding: 14, borderRadius: 10, border: '1px solid var(--color-border, #eaeaea)' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>Primary Image (Top / Background):</span>
                    {form.mission_image1 ? (
                      <img src={form.mission_image1} alt="Primary Showcase" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--color-border, #eaeaea)' }} />
                    ) : (
                      <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                        Default: images/about/tab1.jpg
                      </div>
                    )}
                  </div>
                  <div style={{ background: 'var(--color-bg-subtle, #f8f9fa)', padding: 14, borderRadius: 10, border: '1px solid var(--color-border, #eaeaea)' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-muted)', display: 'block', marginBottom: 8 }}>Secondary Image (Bottom / Overlapping):</span>
                    {form.mission_image2 ? (
                      <img src={form.mission_image2} alt="Secondary Showcase" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--color-border, #eaeaea)' }} />
                    ) : (
                      <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: '0.85rem' }}>
                        Default: images/about/tab2.jpg
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Header with Close option */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-card, #fff)', padding: '12px 18px', borderRadius: 10, border: '1px solid var(--color-border, #eaeaea)' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Editing Mission & Vision</span>
                <button className="btn btn-outline btn-sm" onClick={() => setEditingMissionVision(false)}>Close Form</button>
              </div>

              {/* Showcase Images Upload Card */}
              <div className="card" style={{ gridColumn: '1 / -1', padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <ImageIcon size={20} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Showcase Images</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                      These two images appear on the left side of Mission & Vision on the frontend /about page.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <ImageUpload
                    label="Primary Showcase Image (Top / Background - tab1)"
                    value={form.mission_image1 || ''}
                    onChange={(v) => set('mission_image1', v)}
                  />
                  <ImageUpload
                    label="Secondary Showcase Image (Bottom / Overlapping - tab2)"
                    value={form.mission_image2 || ''}
                    onChange={(v) => set('mission_image2', v)}
                  />
                </div>
              </div>

              {/* Mission Card */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Target size={20} style={{ color: 'var(--color-primary)' }} />
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Our Mission</h3>
                </div>
                <TextField
                  label="Tab Title"
                  value={form.mission_title || 'Our Mission'}
                  onChange={(e) => set('mission_title', e.target.value)}
                />
                <TextArea
                  label="Description"
                  value={form.mission_body || ''}
                  onChange={(e) => set('mission_body', e.target.value)}
                  placeholder="Write the mission description here..."
                />
                <div className="field">
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600 }}>
                    Bullet Points
                    <span style={{ color: 'var(--color-muted)', fontWeight: 400, marginLeft: 6 }}>(one per line)</span>
                  </label>
                  <textarea
                    className="input"
                    rows={6}
                    style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
                    value={form.mission_points || ''}
                    onChange={(e) => set('mission_points', e.target.value)}
                    placeholder={"Expert coaching and development programs\nState-of-the-art courts and facilities\nFrequent local and regional tournaments\nFitness and agility training plans"}
                  />
                  <small style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>Each line becomes one bullet point on the About page.</small>
                </div>
              </div>

              {/* Vision Card */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Eye size={20} style={{ color: 'var(--color-primary)' }} />
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Our Vision</h3>
                </div>
                <TextField
                  label="Tab Title"
                  value={form.vision_title || 'Our Vision'}
                  onChange={(e) => set('vision_title', e.target.value)}
                />
                <TextArea
                  label="Description"
                  value={form.vision_body || ''}
                  onChange={(e) => set('vision_body', e.target.value)}
                  placeholder="Write the vision description here..."
                />
                <div className="field">
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600 }}>
                    Bullet Points
                    <span style={{ color: 'var(--color-muted)', fontWeight: 400, marginLeft: 6 }}>(one per line)</span>
                  </label>
                  <textarea
                    className="input"
                    rows={6}
                    style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
                    value={form.vision_points || ''}
                    onChange={(e) => set('vision_points', e.target.value)}
                    placeholder={"Producing state and national champions\nPromoting a healthy and active lifestyle\nProviding world-class sports education\nFostering teamwork and lifelong friendships"}
                  />
                  <small style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>Each line becomes one bullet point on the About page.</small>
                </div>
              </div>

              {/* Save & Close Buttons */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button className="btn btn-outline" onClick={() => setEditingMissionVision(false)} disabled={saving}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={saveMissionVision} disabled={saving} style={{ minWidth: 160 }}>
                  {saving ? 'Saving…' : 'Save & Close'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STATS / COUNTERS ── */}
      {tab === 'Stats / Counters' && (
        <ListEditor
          items={counters || []} onSave={saveCounters} saving={saving}
          empty={{ label: '', value: 0, icon: '' }}
          renderFields={(item, update) => (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', marginBottom: 12 }}>
                <TextField label="Text Label (e.g. TOURNAMENT AWARDS)" value={item.label || ''} onChange={(e) => update({ label: e.target.value })} />
                <TextField label="Counter Number (e.g. 196)" type="number" value={item.value ?? ''} onChange={(e) => update({ value: Number(e.target.value) })} />
              </div>
              <ImageUpload label="Icon / Logo Image (Upload or Image URL)" value={item.icon || ''} onChange={(v) => update({ icon: v })} />
            </>
          )}
          title={(item) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {item.icon ? (
                <img src={item.icon} alt="" style={{ width: 24, height: 24, objectFit: 'contain', borderRadius: 4 }} />
              ) : null}
              <span>{item.label || 'Untitled stat'} — <strong>{item.value || 0}</strong></span>
            </div>
          )}
        />
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
          Manage stats below. Click any stat to edit and save it.
        </p>
        <button className="btn btn-primary" onClick={add}>
          <Plus size={16} /> Add stat
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
                    {saving ? 'Saving…' : 'Save stat'}
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
