import { useRef } from 'react'
import { UploadCloud, Image as ImageIcon, Video, X } from 'lucide-react'

// Reads the chosen file as a data URL or resolves existing paths for preview.
const resolvePreviewUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url
  }
  return `http://localhost:3000/${url.replace(/^\//, '')}`
}

export default function ImageUpload({ value, onChange, label = 'Image' }) {
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    if (file.type && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const maxDim = 1200
          let w = img.width
          let h = img.height
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w)
              w = maxDim
            } else {
              w = Math.round((w * maxDim) / h)
              h = maxDim
            }
          }
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, w, h)
          const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
          const compressed = canvas.toDataURL(outputType, 0.85)
          onChange(compressed)
        }
        img.onerror = () => {
          // Fallback to raw base64 if canvas drawing fails
          onChange(e.target.result)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      const reader = new FileReader()
      reader.onload = () => onChange(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const isBase64 = value?.startsWith('data:')
  const previewSrc = resolvePreviewUrl(value)

  return (
    <div className="field">
      <label>{label}</label>
      <div className="dropzone" onClick={() => inputRef.current?.click()} style={{ cursor: 'pointer' }}>
        {value ? (
          value.includes('video') || value.endsWith('.mp4') ? (
            <video src={previewSrc} autoPlay loop muted playsInline className="thumb-lg" />
          ) : (
            <img
              src={previewSrc}
              alt=""
              className="thumb-lg"
              onError={(e) => {
                // If remote preview fails, don't permanently break
                e.currentTarget.style.opacity = '0.5'
              }}
            />
          )
        ) : (
          <div className="thumb-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon size={22} color="var(--color-text-muted)" />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500 }}>
            <UploadCloud size={16} /> Click to upload / replace
          </div>
          <div className="hint">Images & Videos (.mp4). ~5MB Max. Or paste link below.</div>
        </div>
      </div>

      {isBase64 ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 6,
          fontSize: 13,
          color: '#166534',
          marginTop: 6
        }}>
          <span>✓ Image uploaded ready to save</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ padding: '2px 8px', height: 'auto', fontSize: 12, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4 }}
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
          >
            <X size={13} /> Remove
          </button>
        </div>
      ) : (
        <input
          className="input"
          placeholder="images/slides/bannerv1.jpg or https://..."
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ marginTop: 6 }}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        hidden
        onClick={(e) => { e.target.value = '' }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
