import { http } from './httpClient'

const BASE = '/testimonials'

export const testimonialsService = {
  list: () => (http.get('/admin/testimonials').then((r) => r.data)),
  get: (id) => (http.get(`/admin/testimonials/${id}`).then((r) => r.data)),
  create: (data) => (http.post('/admin/testimonials', data).then((r) => r.data)),
  update: (id, data) => (http.patch(`/admin/testimonials/${id}`, data).then((r) => r.data)),
  remove: (id) => (http.delete(`/admin/testimonials/${id}`).then((r) => r.data)),
  reorder: (orderedIds) => (Promise.resolve()),
}
