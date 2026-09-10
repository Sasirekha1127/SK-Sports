import { useEffect, useRef, useState } from 'react'
import { UploadCloud, Trash2, Copy, Image as ImageIcon } from 'lucide-react'
import { mediaService } from '../services/media.service'
import { useToast } from '../context/ToastContext.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function MediaLibrary() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const inputRef = useRef(null)

  const load = () => {
    setLoading(true)
    mediaService.list().then((data) => { setItems(data); setLoading(false) })
  }
  useEffect(load, [])

  const handleFiles = async (files) => {
    for (const file of Array.from(files)) {
      const url = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
      await mediaService.create({ name: file.name, url, folder: 'uploads' })
    }
    toast.success(`${files.length} file(s) uploaded`)
    load()
  }

  const copyPath = (url) => {
    navigator.clipboard?.writeText(url)
    toast.success('Path copied')
  }

  const confirmDelete = async () => {
    await mediaService.remove(confirmTarget.id)
    toast.success('File deleted')
    setConfirmTarget(null)
    load()
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Media Library</h1>
          <p>Every image used across banners, blog posts, team, events and settings.</p>
        </div>
        <button className="btn btn-primary" onClick={() => inputRef.current?.click()}>
          <UploadCloud size={16} /> Upload images
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden
          onChange={(e) => e.target.files?.length && handleFiles(e.target.files)} />
      </div>

      <div
        className="card"
        style={{ padding: 24, marginBottom: 20, textAlign: 'center', borderStyle: 'dashed', cursor: 'pointer' }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); e.dataTransfer.files?.length && handleFiles(e.dataTransfer.files) }}
      >
        <UploadCloud size={22} style={{ marginBottom: 8, color: 'var(--color-text-muted)' }} />
        <div style={{ fontSize: 14 }}>Drag & drop images here, or click to browse</div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14 }}>
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 130 }} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No media yet" description="Upload images to reuse them across events, blog posts, team and more." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14 }}>
          {items.map((m) => (
            <div key={m.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ aspectRatio: '4/3', background: '#f0f1ee' }}>
                <img src={m.url} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => (e.currentTarget.style.opacity = 0)} />
              </div>
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => copyPath(m.url)}><Copy size={13} /> Copy</button>
                  <button className="btn btn-ghost btn-icon" onClick={() => setConfirmTarget(m)}><Trash2 size={15} color="var(--color-danger)" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this file?"
        description="This removes it from the media library. Anything still referencing this path will show a broken image."
        onCancel={() => setConfirmTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
