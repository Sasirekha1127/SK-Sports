import { http } from './httpClient'

const BASE = '/admin/users'

export const adminUsersService = {
  list: () => (http.get(BASE).then((r) => r.data)),
  get: (id) => (http.get(`${BASE}/${id}`).then((r) => r.data)),
  create: (data) => (http.post(BASE, data).then((r) => r.data)),
  update: (id, data) => (http.patch(`${BASE}/${id}`, data).then((r) => r.data)),
  remove: (id) => (http.delete(`${BASE}/${id}`).then((r) => r.data)),
  changePassword: (data) => (http.post('/admin/change-password', data).then((r) => r.data)),
  resetPassword: (data) => (http.post('/admin/reset-password', data).then((r) => r.data)),
}
