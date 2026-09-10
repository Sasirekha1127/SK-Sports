import { http } from './httpClient'

const BASE = '/blog'

const toDateStr = (val) => {
  if (!val) return ''
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val
  const d = new Date(val)
  if (isNaN(d.getTime())) return typeof val === 'string' ? val.slice(0, 10) : ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const blogService = {
  list: () => (http.get('/blogs').then((r) => r.data.data.map(b => ({ ...b, category: b.tag, date: toDateStr(b.publish_date), excerpt: b.content, image: b.image_url, featured: !!b.featured })))),
  get: (id) => (http.get(`/blogs/${id}`).then((r) => { const b = r.data.data; return { ...b, category: b.tag, date: toDateStr(b.publish_date), excerpt: b.content, image: b.image_url, featured: !!b.featured }; })),
  create: (data) => (http.post('/admin/blogs', { ...data, tag: data.category, publish_date: data.date, content: data.excerpt, image_url: data.image }).then((r) => r.data)),
  update: (id, data) => (http.patch(`/admin/blogs/${id}`, { ...data, tag: data.category, publish_date: data.date, content: data.excerpt, image_url: data.image }).then((r) => r.data)),
  remove: (id) => (http.delete(`/admin/blogs/${id}`).then((r) => r.data)),
  reorder: (orderedIds) => (Promise.resolve()), // Not in real backend yet
}
