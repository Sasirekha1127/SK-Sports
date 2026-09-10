import { http } from './httpClient'

const BASE = '/team'

export const teamService = {
  list: () => (http.get('/admin/team').then((r) => r.data)),
  get: (id) => (http.get(`/admin/team/${id}`).then((r) => r.data)),
  create: (data) => (http.post('/admin/team', data).then((r) => r.data)),
  update: (id, data) => (http.patch(`/admin/team/${id}`, data).then((r) => r.data)),
  remove: (id) => (http.delete(`/admin/team/${id}`).then((r) => r.data)),
  reorder: (orderedIds) => (Promise.resolve()),
}
