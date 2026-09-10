import { http } from './httpClient'

const BASE = '/media'

export const mediaService = {
  list: () => (http.get('/admin/media').then((r) => r.data)),
  get: (id) => (http.get(`/admin/media/${id}`).then((r) => r.data)),
  create: (data) => (http.post('/admin/media', data).then((r) => r.data)),
  update: (id, data) => (http.patch(`/admin/media/${id}`, data).then((r) => r.data)),
  remove: (id) => (http.delete(`/admin/media/${id}`).then((r) => r.data)),
  
}

