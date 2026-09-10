import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import Modal from './Modal.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import EmptyState from './EmptyState.jsx'
import { TextField, TextArea, SelectField } from './FormField.jsx'
import ImageUpload from './ImageUpload.jsx'
import Switch from './Switch.jsx'
import { useToast } from '../context/ToastContext.jsx'

const emptyFromFields = (fields) =>
  Object.fromEntries(fields.map((f) => [f.name, f.type === 'switch' ? false : '']))

/**
 * Generic list + add/edit/delete manager used by every simple content
 * module (Events, Blog, Team, Testimonials, Partners, Products,
 * Navigation, Admin Users). Bespoke pages (Homepage, About, Settings,
 * Contact Messages) are hand-built instead since they aren't flat lists.
 */
const formatDateForInput = (val) => {
  if (!val) return ''
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val
  const d = new Date(val)
  if (isNaN(d.getTime())) return typeof val === 'string' ? val.slice(0, 10) : ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function ResourceManager({
  title,
  description,
  itemLabel = 'item',
  service,
  columns,
  formFields,
  searchKeys = [],
  statusFilterKey,
  statusFilterOptions,
  icon: Icon,
  pageSize = 8,
}) {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    service.list().then((data) => { setItems(data); setLoading(false) })
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    let rows = items
    if (statusFilterKey && statusFilter !== 'all') {
      rows = rows.filter((r) => String(r[statusFilterKey]) === statusFilter)
    }
    if (query.trim() && searchKeys.length) {
      const q = query.toLowerCase()
      rows = rows.filter((r) => searchKeys.some((k) => String(r[k] || '').toLowerCase().includes(q)))
    }
    return rows
  }, [items, query, statusFilter, statusFilterKey, searchKeys])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyFromFields(formFields))
    setModalOpen(true)
  }
  const openEdit = (row) => {
    setEditing(row)
    setForm(Object.fromEntries(formFields.map((f) => {
      let val = row[f.name] ?? (f.type === 'switch' ? false : '')
      if (f.type === 'date' && val) {
        val = formatDateForInput(val)
      }
      return [f.name, val]
    })))
    setModalOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await service.update(editing.id, form)
        toast.success(`${itemLabel} updated`)
      } else {
        await service.create(form)
        toast.success(`${itemLabel} created`)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await service.remove(confirmTarget.id)
      toast.success(`${itemLabel} deleted`)
      setConfirmTarget(null)
      load()
    } catch {
      toast.error('Could not delete')
    } finally {
      setDeleting(false)
    }
  }

  const quickToggle = async (row, key) => {
    try {
      await service.update(row.id, { ...row, [key]: !row[key] })
      load()
    } catch (e) {
      console.error(e)
      toast.error('Toggle failed: ' + (e.message || 'Unknown server error'))
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add {itemLabel}
        </button>
      </div>

      <div className="card">
        <div style={{ padding: 16 }} className="toolbar">
          {searchKeys.length > 0 && (
            <div className="search-box">
              <Search size={15} />
              <input className="input" placeholder={`Search ${itemLabel}s…`} value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1) }} />
            </div>
          )}
          {statusFilterKey && (
            <select className="select" style={{ maxWidth: 160 }} value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
              <option value="all">All statuses</option>
              {statusFilterOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
        </div>

        {loading ? (
          <div style={{ padding: 24 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 44, marginBottom: 10 }} />)}
          </div>
        ) : pageRows.length === 0 ? (
          <EmptyState icon={Icon} title={`No ${itemLabel}s found`}
            description={items.length === 0 ? `You haven't added any ${itemLabel}s yet.` : 'Try a different search or filter.'}
            action={<button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add {itemLabel}</button>} />
        ) : (
          <div className="table-wrap">
            <table className="dt">
              <thead>
                <tr>
                  {columns.map((c) => <th key={c.key}>{c.header}</th>)}
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id}>
                    {columns.map((c) => (
                      <td key={c.key}>
                        {c.toggle
                          ? <Switch checked={!!row[c.key]} onChange={() => quickToggle(row, c.key)} />
                          : c.render ? c.render(row) : row[c.key]}
                      </td>
                    ))}
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-icon" onClick={() => openEdit(row)} aria-label="Edit"><Pencil size={16} /></button>
                        <button className="btn btn-ghost btn-icon" onClick={() => setConfirmTarget(row)} aria-label="Delete"><Trash2 size={16} color="var(--color-danger)" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="pagination">
            <span>{filtered.length} {itemLabel}{filtered.length === 1 ? '' : 's'}</span>
            <div className="controls">
              <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
              <span style={{ padding: '0 6px' }}>{page} / {totalPages}</span>
              <button className="btn btn-outline btn-sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${itemLabel}` : `Add ${itemLabel}`}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</button>
            <button className="btn btn-primary" form="resource-form" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save changes' : `Add ${itemLabel}`}
            </button>
          </>
        }
      >
        <form id="resource-form" onSubmit={submit}>
          {formFields.map((f) => {
            const value = form[f.name]
            const onChange = (v) => setForm((s) => ({ ...s, [f.name]: v }))
            if (f.type === 'textarea') return <TextArea key={f.name} label={f.label} value={value} required={f.required}
              onChange={(e) => onChange(e.target.value)} />
            if (f.type === 'select') return <SelectField key={f.name} label={f.label} options={f.options} value={value}
              onChange={(e) => onChange(e.target.value)} />
            if (f.type === 'image') return <ImageUpload key={f.name} label={f.label} value={value} onChange={onChange} />
            if (f.type === 'switch') return (
              <div key={f.name} className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Switch checked={!!value} onChange={onChange} />
                <label style={{ marginBottom: 0 }}>{f.label}</label>
              </div>
            )
            if (f.type === 'date') return (
              <TextField
                key={f.name}
                label={f.label}
                type="date"
                value={formatDateForInput(value)}
                required={f.required}
                onChange={(e) => onChange(e.target.value)}
              />
            )
            return <TextField key={f.name} label={f.label} type={f.type || 'text'} value={value} required={f.required}
              onChange={(e) => onChange(e.target.value)} />
          })}
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmTarget}
        title={`Delete this ${itemLabel}?`}
        description={`This will permanently remove "${confirmTarget?.title || confirmTarget?.name || ''}". This action cannot be undone.`}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  )
}
