import { http } from './httpClient'

const BASE = '/events'

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

export const eventsService = {
  list: () => (http.get('/events').then((r) => r.data.data.map(e => ({ ...e, date: toDateStr(e.event_date), time: e.event_time })))),
  get: (id) => (http.get(`/events/${id}`).then((r) => { const e = r.data.data; return { ...e, date: toDateStr(e.event_date), time: e.event_time }; })),
  create: (data) => (http.post('/admin/events', { ...data, event_date: data.date, event_time: data.time }).then((r) => r.data)),
  update: (id, data) => (http.patch(`/admin/events/${id}`, { ...data, event_date: data.date, event_time: data.time }).then((r) => r.data)),
  remove: (id) => (http.delete(`/admin/events/${id}`).then((r) => r.data)),
  reorder: (orderedIds) => (Promise.resolve()), // Not in real backend yet
}
